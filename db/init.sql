CREATE TABLE IF NOT EXISTS channels
(
  channel_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_name VARCHAR(50) NOT NULL UNIQUE,
  wz_id VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS tokens
(
    token_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expires_at VARCHAR(50) NOT NULL,
    access_token VARCHAR(1024) NOT NULL,
    refresh_token VARCHAR(1024) NOT NULL,
    service_name VARCHAR(50) NOT NULL,
    channel_id UUID NOT NULL,
    CONSTRAINT fk_channel_id
        FOREIGN KEY(channel_id)
            REFERENCES channels(channel_id)
            ON DELETE CASCADE
);   

CREATE TABLE IF NOT EXISTS commands
(
    command_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    command_name VARCHAR(20) NOT NULL,
    channel_id UUID NOT NULL,
    CONSTRAINT fk_channel_id
        FOREIGN KEY(channel_id)
            REFERENCES channels(channel_id)
            ON DELETE CASCADE
);