from http.server import BaseHTTPRequestHandler, HTTPServer
import json

class RequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/log.json':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            with open('weave/state/log.json', 'r') as f:
                self.wfile.write(f.read().encode())
        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        if self.path == '/chat':
            content_length = int(self.headers['Content-Length'])
            body = self.rfile.read(content_length).decode('utf-8')
            with open('weave/queues/commands.jsonl', 'a') as f:
                f.write(body + '\n')
            self.send_response(204)
        else:
            self.send_response(404)

def run(server_class=HTTPServer, handler_class=RequestHandler, port=5004):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f'Serving on port {port}')
    httpd.serve_forever()

if __name__ == '__main__':
    run()