use futures::{SinkExt, StreamExt};
use serde::{Deserialize, Serialize};
use std::sync::{Arc, Mutex};
use tokio::sync::broadcast;
use warp::ws::{Message, WebSocket};
use warp::Filter;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(tag = "type", content = "data")]
enum ClientMessage {
    GetState(Option<serde_json::Value>),
}

#[derive(Clone, Debug, Serialize, Deserialize)]
struct WorldState {
    tick: u64,
    description: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(tag = "type", content = "data")]
enum ServerMessage {
    WorldStateMessage(WorldState),
    Ack(String),
}

#[tokio::main]
async fn main() {
    let (tx, _rx) = broadcast::channel::<ServerMessage>(128);
    let state = Arc::new(Mutex::new(WorldState {
        tick: 0,
        description: "Sanctum online".to_string(),
    }));

    {
        let tx = tx.clone();
        let state = state.clone();
        tokio::spawn(async move {
            loop {
                tokio::time::sleep(std::time::Duration::from_secs(2)).await;
                let mut s = state.lock().unwrap();
                s.tick += 1;
                s.description = format!("Sanctum tick {}", s.tick);
                let _ = tx.send(ServerMessage::WorldStateMessage(s.clone()));
            }
        });
    }

    let tx_filter = warp::any().map(move || tx.clone());
    let state_filter = warp::any().map(move || state.clone());

    let ws_route = warp::path::end()
        .and(warp::ws())
        .and(tx_filter)
        .and(state_filter)
        .map(|ws: warp::ws::Ws, tx, state| {
            ws.on_upgrade(move |socket| handle_socket(socket, tx, state))
        });

    println!("Sanctum server listening on ws://127.0.0.1:9001");
    warp::serve(ws_route).run(([127, 0, 0, 1], 9001)).await;
}

async fn handle_socket(ws: WebSocket, tx: broadcast::Sender<ServerMessage>, state: Arc<Mutex<WorldState>>) {
    let (mut ws_tx, mut ws_rx) = ws.split();

    let mut rx = tx.subscribe();
    let mut ws_tx_clone = ws_tx.clone();

    tokio::spawn(async move {
        while let Ok(msg) = rx.recv().await {
            let json = serde_json::to_string(&msg).unwrap_or_else(|_| "{}".to_string());
            if ws_tx_clone.send(Message::text(json)).await.is_err() {
                break;
            }
        }
    });

    while let Some(result) = ws_rx.next().await {
        if let Ok(msg) = result {
            if msg.is_text() {
                let text = msg.to_str().unwrap_or("");
                if let Ok(client_msg) = serde_json::from_str::<ClientMessage>(text) {
                    match client_msg {
                        ClientMessage::GetState(_) => {
                            let current = state.lock().unwrap().clone();
                            let reply = ServerMessage::WorldStateMessage(current);
                            let json = serde_json::to_string(&reply).unwrap();
                            let _ = ws_tx.send(Message::text(json)).await;
                        }
                    }
                } else {
                    let ack = ServerMessage::Ack("Unknown message".to_string());
                    let json = serde_json::to_string(&ack).unwrap();
                    let _ = ws_tx.send(Message::text(json)).await;
                }
            }
        }
    }
}