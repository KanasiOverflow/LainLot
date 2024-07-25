using Microsoft.Extensions.Configuration;

namespace Config
{
    public static class ConnectionStrings
    {
        public static string? DEVConnectionString => GetConnnectionString("ConnectionStrings:DEV");

        public static string? PRODConnectionString => GetConnnectionString("ConnectionStrings:PROD");

        private static string? GetConnnectionString(string param)
        {
            var configuration = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);
            var config = configuration.Build();

            return config[param];
        }
    }
}