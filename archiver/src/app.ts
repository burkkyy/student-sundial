import express from "express"
import cors from "cors"
import helmet from "helmet"

import { FRONTEND_URL } from "@/config"
import { requestLoggerMiddleware } from "@/middlewares"
import router from "@/router"

export const app = express()
app.use(express.json())

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "default-src": ["'self'", FRONTEND_URL],
      "base-uri": ["'self'"],
      "block-all-mixed-content": [],
      "font-src": ["'self'", "https:", "data:"],
      "frame-ancestors": ["'self'"],
      "img-src": ["'self'", "data:", "https:"],
      "object-src": ["'none'"],
      "script-src": ["'self'", "'unsafe-eval'"],
      "script-src-attr": ["'none'"],
      "style-src": ["'self'", "https:", "'unsafe-inline'"],
      "worker-src": ["'self'", "blob:"],
      "connect-src": ["'self'", FRONTEND_URL],
    },
  })
)

// very basic CORS setup
app.use(
  cors({
    origin: FRONTEND_URL,
    optionsSuccessStatus: 200,
    credentials: true,
  })
)

app.use(requestLoggerMiddleware)

app.use(router)

export default app
