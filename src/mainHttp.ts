import express from "express";
import { server } from "./server.js"
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

const app = express();
app.use(express.json());

app.post("/mcp", async (req, res) => {
    try {
        // @ts-ignore
        const transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: undefined,
            enableJsonResponse: true
        });

        res.on("close", () => {
            transport.close();
        });

        await server.connect(transport as any);
        await transport.handleRequest(req, res, req.body);
    } catch (error) {
        console.error("Error handling MCP request:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

const PORT = 8001;
app.listen(PORT, () => {
    console.log(`MCP Server is running and listening on port ${PORT}...`);
}).on("error", (error) => {
    console.error("Error starting the MCP Server:", error);
    process.exit(1);
});