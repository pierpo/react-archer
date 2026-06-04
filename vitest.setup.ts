// jsdom only ships a throwing stub for window.resizeTo; replace it so resize-driven tests run quietly.
window.resizeTo = () => {};
