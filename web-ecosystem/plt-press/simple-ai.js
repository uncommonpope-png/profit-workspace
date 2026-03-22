// Simple AI Analysis - Local AI Only
function analyzeDecision(profit, love, tax) {
    const score = profit + love - tax;
    
    // Smart analysis based on PLT framework
    let analysis = '';
    
    if (score >= 10) {
        analysis = `Exceptional opportunity! With Profit ${profit}, Love ${love}, and Tax ${tax}, this decision offers outstanding value. The high relationship building (Love) combined with strong gains (Profit) creates compound benefits that far exceed the costs.`;
    } else if (score >= 6) {
        analysis = `Solid opportunity worth pursuing. Your PLT score of ${score} indicates good returns. ${profit >= 7 ? 'Strong profit potential' : love >= 7 ? 'Excellent relationship building' : 'Manageable costs'} make this attractive.`;
    } else if (score >= 2) {
        analysis = `Mixed decision requiring careful consideration. With Tax ${tax}, you're paying significant costs. ${profit < 5 ? 'Consider ways to increase profit potential' : love < 5 ? 'Look for relationship building opportunities' : 'Explore options to reduce costs'}.`;
    } else if (score >= 0) {
        analysis = `Marginal decision. The costs (Tax ${tax}) nearly equal the benefits. This is break-even territory - only proceed if strategic value justifies the resource investment.`;
    } else {
        analysis = `High-risk decision with negative PLT score. Tax ${tax} significantly outweighs combined Profit ${profit} and Love ${love}. Strong recommendation to decline or substantially renegotiate terms.`;
    }
    
    // Add contextual advice
    if (profit >= 8 && love <= 3) {
        analysis += ' Consider: High profit with low relationship value may indicate short-term thinking.';
    } else if (love >= 8 && profit <= 3) {
        analysis += ' Consider: Strong relationships are valuable, but ensure adequate return on investment.';
    } else if (tax >= 8) {
        analysis += ' Warning: High costs require exceptional benefits to justify this decision.';
    }
    
    return analysis;
}