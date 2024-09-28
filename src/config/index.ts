// directly address korar jonno index.ts name dawa hoise
// automatic refer
import dotenv from "dotenv";
dotenv.config();



export default {
    port: process.env.PORT,
    db_url: process.env.DB_URL
}
