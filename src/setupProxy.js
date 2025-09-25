// src/setupProxy.js
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/ask",
    createProxyMiddleware({
      target: "http://localhost:8001",
      changeOrigin: true,
    })
  );

  app.use(
    "/ingestion",
    createProxyMiddleware({
      target: "http://localhost:8000",
      changeOrigin: true,
    })
  ); 
};
