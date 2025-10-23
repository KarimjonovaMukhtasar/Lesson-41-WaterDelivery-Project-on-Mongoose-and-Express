import "dotenv/config"

export const config = {
    accessSecret: process.env.JWT_ACCESSSECRET,
    refreshSecret: process.env.JWT_REFRESHSECRET
}