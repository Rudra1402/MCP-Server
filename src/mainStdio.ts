import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { server } from "./server.js";

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.log("MCP Server is running and connected via stdio transport...");
}

main().catch((error) => {
    console.error("Error starting the MCP Server:", error);
    process.exit(1);
});