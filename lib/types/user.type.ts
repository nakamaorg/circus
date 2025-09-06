export type TUser = {
  id: string;
  name: string;
  autobiography: string;
  wanted: boolean;
  permissions?: number;
  discord: {
    id: string;
    name: string;
    avatar: string | null;
  };
};

export type TUserDynamoDB = {
  id: { S: string };
  username: { S: string };
  autobiography: { S: string };
  discord_id: { N: string };
  wanted: { BOOL: boolean };
  permissions?: { N: string };
};
