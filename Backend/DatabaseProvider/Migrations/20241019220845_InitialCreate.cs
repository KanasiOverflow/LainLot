using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace DatabaseProvider.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AccessLevels",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Level = table.Column<int>(type: "integer", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("AccessLevels_pkey", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Colors",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    HexCode = table.Column<string>(type: "character varying(7)", maxLength: 7, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("Colors_pkey", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "FabricTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("FabricTypes_pkey", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Languages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    FullName = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Abbreviation = table.Column<string>(type: "character varying(5)", maxLength: 5, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    DateFormat = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    TimeFormat = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("Languages_pkey", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "OrderStatuses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("OrderStatuses_pkey", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Price = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    StockQuantity = table.Column<int>(type: "integer", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    IsCustomizable = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("Products_pkey", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UserRoles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    FkAccessLevels = table.Column<int>(type: "integer", nullable: false),
                    Name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("UserRoles_pkey", x => x.Id);
                    table.ForeignKey(
                        name: "UserRoles_FkAccessLevels_fkey",
                        column: x => x.FkAccessLevels,
                        principalTable: "AccessLevels",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "About",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    FkLanguages = table.Column<int>(type: "integer", nullable: false),
                    Header = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Text = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("About_pkey", x => x.Id);
                    table.ForeignKey(
                        name: "About_FkLanguages_fkey",
                        column: x => x.FkLanguages,
                        principalTable: "Languages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    FkLanguages = table.Column<int>(type: "integer", nullable: false),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("Categories_pkey", x => x.Id);
                    table.ForeignKey(
                        name: "Categories_FkLanguages_fkey",
                        column: x => x.FkLanguages,
                        principalTable: "Languages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Contacts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    FkLanguages = table.Column<int>(type: "integer", nullable: false),
                    Address = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Phone = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Email = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("Contacts_pkey", x => x.Id);
                    table.ForeignKey(
                        name: "Contacts_FkLanguages_fkey",
                        column: x => x.FkLanguages,
                        principalTable: "Languages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CustomizableProducts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    FkProducts = table.Column<int>(type: "integer", nullable: false),
                    FkFabricTypes = table.Column<int>(type: "integer", nullable: true),
                    FkColors = table.Column<int>(type: "integer", nullable: true),
                    SizeOptions = table.Column<string>(type: "text", nullable: true),
                    CustomizationDetails = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("CustomizableProducts_pkey", x => x.Id);
                    table.ForeignKey(
                        name: "CustomizableProducts_FkColors_fkey",
                        column: x => x.FkColors,
                        principalTable: "Colors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "CustomizableProducts_FkFabricTypes_fkey",
                        column: x => x.FkFabricTypes,
                        principalTable: "FabricTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "CustomizableProducts_FkProducts_fkey",
                        column: x => x.FkProducts,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProductImages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    FkProducts = table.Column<int>(type: "integer", nullable: false),
                    ImageData = table.Column<byte[]>(type: "bytea", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("ProductImages_pkey", x => x.Id);
                    table.ForeignKey(
                        name: "ProductImages_FkProducts_fkey",
                        column: x => x.FkProducts,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProductTranslations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    FkLanguages = table.Column<int>(type: "integer", nullable: false),
                    FkProducts = table.Column<int>(type: "integer", nullable: false),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("ProductTranslations_pkey", x => x.Id);
                    table.ForeignKey(
                        name: "ProductTranslations_FkLanguages_fkey",
                        column: x => x.FkLanguages,
                        principalTable: "Languages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "ProductTranslations_FkProducts_fkey",
                        column: x => x.FkProducts,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    FkUserRoles = table.Column<int>(type: "integer", nullable: false),
                    Login = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    Email = table.Column<string>(type: "character varying(60)", maxLength: 60, nullable: false),
                    Password = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    ConfirmEmail = table.Column<int>(type: "integer", nullable: false),
                    Hash = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("Users_pkey", x => x.Id);
                    table.ForeignKey(
                        name: "Users_FkUserRoles_fkey",
                        column: x => x.FkUserRoles,
                        principalTable: "UserRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CategoryHierarchy",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ParentId = table.Column<int>(type: "integer", nullable: true),
                    FkCategories = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("CategoryHierarchy_pkey", x => x.Id);
                    table.ForeignKey(
                        name: "CategoryHierarchy_FkCategories_fkey",
                        column: x => x.FkCategories,
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "CategoryHierarchy_ParentId_fkey",
                        column: x => x.ParentId,
                        principalTable: "CategoryHierarchy",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Cart",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    FkUsers = table.Column<int>(type: "integer", nullable: false),
                    FkProducts = table.Column<int>(type: "integer", nullable: false),
                    Quantity = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("Cart_pkey", x => x.Id);
                    table.ForeignKey(
                        name: "Cart_FkProducts_fkey",
                        column: x => x.FkProducts,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "Cart_FkUsers_fkey",
                        column: x => x.FkUsers,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Orders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    FkUsers = table.Column<int>(type: "integer", nullable: false),
                    FkOrderStatus = table.Column<int>(type: "integer", nullable: false),
                    TotalAmount = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    OrderDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    ShippingAddress = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    TrackingNumber = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    ShippingMethod = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    PaymentStatus = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("Orders_pkey", x => x.Id);
                    table.ForeignKey(
                        name: "Orders_FkOrderStatus_fkey",
                        column: x => x.FkOrderStatus,
                        principalTable: "OrderStatuses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "Orders_FkUsers_fkey",
                        column: x => x.FkUsers,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Reviews",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    FkProducts = table.Column<int>(type: "integer", nullable: false),
                    FkUsers = table.Column<int>(type: "integer", nullable: false),
                    Rating = table.Column<int>(type: "integer", nullable: false),
                    Comment = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("Reviews_pkey", x => x.Id);
                    table.ForeignKey(
                        name: "Reviews_FkProducts_fkey",
                        column: x => x.FkProducts,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "Reviews_FkUsers_fkey",
                        column: x => x.FkUsers,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserProfiles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    FkUsers = table.Column<int>(type: "integer", nullable: false),
                    FirstName = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    LastName = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    MiddleName = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    Address = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    City = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    ZipPostCode = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                    StateProvince = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    Country = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    Phone = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    Avatar = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("UserProfiles_pkey", x => x.Id);
                    table.ForeignKey(
                        name: "UserProfiles_FkUsers_fkey",
                        column: x => x.FkUsers,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CustomizationOrders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    FkOrders = table.Column<int>(type: "integer", nullable: false),
                    FkProducts = table.Column<int>(type: "integer", nullable: false),
                    FkFabricTypes = table.Column<int>(type: "integer", nullable: true),
                    FkColors = table.Column<int>(type: "integer", nullable: true),
                    Size = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                    AdditionalNotes = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("CustomizationOrders_pkey", x => x.Id);
                    table.ForeignKey(
                        name: "CustomizationOrders_FkColors_fkey",
                        column: x => x.FkColors,
                        principalTable: "Colors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "CustomizationOrders_FkFabricTypes_fkey",
                        column: x => x.FkFabricTypes,
                        principalTable: "FabricTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "CustomizationOrders_FkOrders_fkey",
                        column: x => x.FkOrders,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "CustomizationOrders_FkProducts_fkey",
                        column: x => x.FkProducts,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OrderHistory",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    FkOrders = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    ChangedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("OrderHistory_pkey", x => x.Id);
                    table.ForeignKey(
                        name: "OrderHistory_FkOrders_fkey",
                        column: x => x.FkOrders,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "OrderHistory_Status_fkey",
                        column: x => x.Status,
                        principalTable: "OrderStatuses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Payments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    FkOrders = table.Column<int>(type: "integer", nullable: false),
                    PaymentDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    Amount = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    PaymentMethod = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("Payments_pkey", x => x.Id);
                    table.ForeignKey(
                        name: "Payments_FkOrders_fkey",
                        column: x => x.FkOrders,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_About_FkLanguages",
                table: "About",
                column: "FkLanguages");

            migrationBuilder.CreateIndex(
                name: "IX_Cart_FkProducts",
                table: "Cart",
                column: "FkProducts");

            migrationBuilder.CreateIndex(
                name: "IX_Cart_FkUsers",
                table: "Cart",
                column: "FkUsers");

            migrationBuilder.CreateIndex(
                name: "IX_Categories_FkLanguages",
                table: "Categories",
                column: "FkLanguages");

            migrationBuilder.CreateIndex(
                name: "IX_CategoryHierarchy_FkCategories",
                table: "CategoryHierarchy",
                column: "FkCategories");

            migrationBuilder.CreateIndex(
                name: "IX_CategoryHierarchy_ParentId",
                table: "CategoryHierarchy",
                column: "ParentId");

            migrationBuilder.CreateIndex(
                name: "IX_Contacts_FkLanguages",
                table: "Contacts",
                column: "FkLanguages");

            migrationBuilder.CreateIndex(
                name: "IX_CustomizableProducts_FkColors",
                table: "CustomizableProducts",
                column: "FkColors");

            migrationBuilder.CreateIndex(
                name: "IX_CustomizableProducts_FkFabricTypes",
                table: "CustomizableProducts",
                column: "FkFabricTypes");

            migrationBuilder.CreateIndex(
                name: "IX_CustomizableProducts_FkProducts",
                table: "CustomizableProducts",
                column: "FkProducts");

            migrationBuilder.CreateIndex(
                name: "IX_CustomizationOrders_FkColors",
                table: "CustomizationOrders",
                column: "FkColors");

            migrationBuilder.CreateIndex(
                name: "IX_CustomizationOrders_FkFabricTypes",
                table: "CustomizationOrders",
                column: "FkFabricTypes");

            migrationBuilder.CreateIndex(
                name: "IX_CustomizationOrders_FkOrders",
                table: "CustomizationOrders",
                column: "FkOrders");

            migrationBuilder.CreateIndex(
                name: "IX_CustomizationOrders_FkProducts",
                table: "CustomizationOrders",
                column: "FkProducts");

            migrationBuilder.CreateIndex(
                name: "IX_OrderHistory_FkOrders",
                table: "OrderHistory",
                column: "FkOrders");

            migrationBuilder.CreateIndex(
                name: "IX_OrderHistory_Status",
                table: "OrderHistory",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_FkOrderStatus",
                table: "Orders",
                column: "FkOrderStatus");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_FkUsers",
                table: "Orders",
                column: "FkUsers");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_FkOrders",
                table: "Payments",
                column: "FkOrders");

            migrationBuilder.CreateIndex(
                name: "IX_ProductImages_FkProducts",
                table: "ProductImages",
                column: "FkProducts");

            migrationBuilder.CreateIndex(
                name: "IX_ProductTranslations_FkLanguages",
                table: "ProductTranslations",
                column: "FkLanguages");

            migrationBuilder.CreateIndex(
                name: "IX_ProductTranslations_FkProducts",
                table: "ProductTranslations",
                column: "FkProducts");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_FkProducts",
                table: "Reviews",
                column: "FkProducts");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_FkUsers",
                table: "Reviews",
                column: "FkUsers");

            migrationBuilder.CreateIndex(
                name: "IX_UserProfiles_FkUsers",
                table: "UserProfiles",
                column: "FkUsers");

            migrationBuilder.CreateIndex(
                name: "IX_UserRoles_FkAccessLevels",
                table: "UserRoles",
                column: "FkAccessLevels");

            migrationBuilder.CreateIndex(
                name: "IX_Users_FkUserRoles",
                table: "Users",
                column: "FkUserRoles");

            migrationBuilder.CreateIndex(
                name: "Users_Email_key",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "Users_Login_key",
                table: "Users",
                column: "Login",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "About");

            migrationBuilder.DropTable(
                name: "Cart");

            migrationBuilder.DropTable(
                name: "CategoryHierarchy");

            migrationBuilder.DropTable(
                name: "Contacts");

            migrationBuilder.DropTable(
                name: "CustomizableProducts");

            migrationBuilder.DropTable(
                name: "CustomizationOrders");

            migrationBuilder.DropTable(
                name: "OrderHistory");

            migrationBuilder.DropTable(
                name: "Payments");

            migrationBuilder.DropTable(
                name: "ProductImages");

            migrationBuilder.DropTable(
                name: "ProductTranslations");

            migrationBuilder.DropTable(
                name: "Reviews");

            migrationBuilder.DropTable(
                name: "UserProfiles");

            migrationBuilder.DropTable(
                name: "Categories");

            migrationBuilder.DropTable(
                name: "Colors");

            migrationBuilder.DropTable(
                name: "FabricTypes");

            migrationBuilder.DropTable(
                name: "Orders");

            migrationBuilder.DropTable(
                name: "Products");

            migrationBuilder.DropTable(
                name: "Languages");

            migrationBuilder.DropTable(
                name: "OrderStatuses");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "UserRoles");

            migrationBuilder.DropTable(
                name: "AccessLevels");
        }
    }
}
