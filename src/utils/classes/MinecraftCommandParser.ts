import { Rcon } from "minecraft-rcon-client";

export default class MinecraftCommandParser {
  serverHost: string;
  serverPort: number;
  rconPassword: string;
  client: Rcon;

  constructor() {
    if (
      !process.env.MINECRAFT_SERVER_HOST ||
      !process.env.MINECRAFT_SERVER_PORT ||
      !process.env.MINECRAFT_RCON_PASSWORD
    ) {
      throw new Error(
        "ERROR: Missing Minecraft credentials. Please check your .env file."
      );
    }

    this.serverHost = process.env.MINECRAFT_SERVER_HOST;
    this.serverPort = parseInt(process.env.MINECRAFT_SERVER_PORT);
    this.rconPassword = process.env.MINECRAFT_RCON_PASSWORD;
    this.client = new Rcon({
      host: this.serverHost,
      port: this.serverPort,
      password: this.rconPassword,
    });
  }

  async connectClient() {
    await this.client.connect();
  }

  async sendCommand(command: string) {
    if (command.startsWith("/")) {
      command = command.substring(1);
    }
    try {
      const resp = await this.client.send(command);
      if (resp.includes("Unknown command.")) {
        throw new Error("Unknown command.");
      }
    } catch (e) {
      console.log("ERROR: Failed to send command to Minecraft server.");
    }
  }

  async disconnectClient() {
    this.client.disconnect();
  }
}
