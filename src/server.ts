import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import * as quotesService from "./quotesService.js";

export const server = new McpServer({
    name: "Rudra-MCP-Server",
    version: "1.0.0"
});

server.registerTool(
    "get-quote",
    {
        title: "Get Quote",
        description: "Tool to get a random quote based on quote type!",
        inputSchema: {
            quoteType: z.string().describe("Type of quote to retrieve, e.g., happy, sad, neutral")
        }
    },
    async({ quoteType }) => {
        let quote = null;
        if (quoteType === "happy") {
            quote = quotesService.getHappyQuote() ?? "No happy quotes available!";
        } else if (quoteType === "sad") {
            quote = quotesService.getSadQuote() ?? "No sad quotes available!";
        } else {
            quote = quotesService.getNeutralQuote() ?? "No neutral quotes available!";
        }
        return {
            content: [
                {
                    type: "text",
                    text: quote
                }
            ]
        };
    }
);

server.registerTool(
    "get-multiple-quotes",
    {
        title: "Get Multiple Quotes",
        description: "Tool to get a list of random quotes!",
        inputSchema: {
            quoteCt: z.number().describe("Total number of quotes to retrieve")
        }
    },
    async({ quoteCt }) => {
        const quotes = quotesService.getQuotes(quoteCt) ?? [];
        let finalQuotes = "";
        quotes.forEach((quote) => {
            finalQuotes += quote + "\n";
        })
        return {
            content: [
                {
                    type: "text",
                    text: finalQuotes
                }
            ]
        };
    }
);

server.registerTool(
    "get-weather",
    {
        title: "Get Weather",
        description: "Tool to get the weather of a city!",
        inputSchema: {
            city: z.string().describe("Name of the city to get the weather for")
        }
    },
    async({ city }) => {
        try {
            const geoResponse = await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`
            );
            const data = await geoResponse.json();

            if (!data.results || data.results.length === 0) {
                return {
                    content: [
                        {
                            type: "text",
                            text: `Could not find weather for the city ${city}!`
                        }
                    ]
                }
            }
            
            const { latitude, longitude } = data.results[0];
            const weatherResponse = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code&hourly=temperature_2m,precipitation&forecast_days=1`
            );
            const weatherData = await weatherResponse.json();

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(weatherData)
                    }
                ]
            }
        } catch (error: any) {
            return {
                content: [
                    {
                        type: "text",
                        text: `An error occurred while fetching the weather data: ${error.message}`
                    }
                ]
            }
        }
    }
);
