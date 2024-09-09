using DatabaseProvider.Enums;
using Microsoft.Extensions.Configuration;

namespace DatabaseProvider
{
    public static class ConnectionStrings
    {
        public static string? ConnectionString => GetConnnectionString();

        private static string? GetConnnectionString()
        {
            var isDevelopment = string.Equals(Environment
                .GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT"), EnvVariables.Development.ToString(),
                StringComparison.InvariantCultureIgnoreCase);

            var connectionString = isDevelopment ? "ConnectionStrings:DEV" : "ConnectionStrings:PROD";

            var configuration = new ConfigurationBuilder()
                .AddJsonFile(isDevelopment ? "appsettings.json" : "appsettings.production.json",
                optional: false, reloadOnChange: true);

            var config = configuration.Build();

            return config[connectionString];
        }
    }
}