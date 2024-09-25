import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import { loginUser } from '@/services/api/api.service';
import { checkUserRole } from '@/services/utils/roleChecker';

export default NextAuth({
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || '',
      clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
      authorization: { params: { scope: 'identify guilds' } },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {    
      if (account && profile) {  // Verifica si profile está definido
          token.accessToken = account.access_token;
          token.discordId = profile.id;
          token.username = profile.username;
      
          // Fetch the guilds the user belongs to
          const response = await fetch('https://discord.com/api/v10/users/@me/guilds', {
            headers: {
              Authorization: `Bearer ${account.access_token}`,
            },
          });
      
          const guilds = await response.json();
          const insanityGuild = guilds.find((guild: any) => guild.id === '428689004129419284');
      
          if (insanityGuild) {
            try {
              // Fetch member data for the Insanity guild
              const memberResponse = await fetch(`https://discord.com/api/v10/guilds/428689004129419284/members/${profile.id}`, {
                headers: {
                  Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,  // Use bot token
                },
              });
      
              const memberData = await memberResponse.json();
              
              token.roles = memberData.roles;

              const hasRequiredRole = (token.roles || []).includes('1179881354167595099');
              if (!hasRequiredRole) {
                token.hasRequiredRole = false;
              } else {
                token.hasRequiredRole = true;
              }

              token.isInInsanity = true; // Marcar que el usuario está en Insanity
            } catch (error) {
              console.error("Error fetching member data: ", error);
            }
          }
        }
      
        return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.discordId = token.discordId;
      session.username = token.username;
      session.isInInsanity = token.isInInsanity;
      session.roles = token.roles;
      session.hasRequiredRole = token.hasRequiredRole;
  
      const roleCheck = checkUserRole(token.roles || []);

      // Asegurarse de que discordId y username no sean undefined
      if (!token.discordId || !token.username) {
        throw new Error("discordId and username must be defined");
      }

      if (!roleCheck.roleName) {
        throw new Error("roleName must be defined");
      }
      
      try {
          const response = await loginUser(token.discordId, token.username, roleCheck.roleName);
      } catch (error) {
          console.error("Error sending data to backend:", error);
      }
  
      return session;
    }
  },
  logger: {
    error(code, metadata) {
      console.error('NextAuth Error:', code, metadata);
    },
  },
  debug: false, // Activa el modo debug para obtener más información
});
