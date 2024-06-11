﻿// <auto-generated />
using System;
using DatabaseProvider.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace DatabaseProvider.Migrations
{
    [DbContext(typeof(LainLotContext))]
    [Migration("20240227100442_InitialCreate")]
    partial class InitialCreate
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.1")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("DatabaseProvider.Models.About", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int>("FkLanguages")
                        .HasColumnType("integer");

                    b.Property<string>("Header")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)");

                    b.Property<string>("Text")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id")
                        .HasName("About_pkey");

                    b.HasIndex("FkLanguages");

                    b.ToTable("About", (string)null);
                });

            modelBuilder.Entity("DatabaseProvider.Models.AccessLevel", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("Level")
                        .HasColumnType("integer");

                    b.HasKey("Id")
                        .HasName("AccessLevels_pkey");

                    b.ToTable("AccessLevels");
                });

            modelBuilder.Entity("DatabaseProvider.Models.Contact", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("Address")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("character varying(255)");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("character varying(255)");

                    b.Property<int>("FkLanguages")
                        .HasColumnType("integer");

                    b.Property<string>("Phone")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("character varying(255)");

                    b.HasKey("Id")
                        .HasName("Contacts_pkey");

                    b.HasIndex("FkLanguages");

                    b.ToTable("Contacts");
                });

            modelBuilder.Entity("DatabaseProvider.Models.Language", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("Abbreviation")
                        .IsRequired()
                        .HasMaxLength(5)
                        .HasColumnType("character varying(5)");

                    b.Property<string>("DateFormat")
                        .IsRequired()
                        .HasMaxLength(20)
                        .HasColumnType("character varying(20)");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("FullName")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)");

                    b.Property<string>("TimeFormat")
                        .IsRequired()
                        .HasMaxLength(20)
                        .HasColumnType("character varying(20)");

                    b.HasKey("Id")
                        .HasName("Languages_pkey");

                    b.ToTable("Languages");
                });

            modelBuilder.Entity("DatabaseProvider.Models.Post", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)");

                    b.Property<string>("Photo")
                        .HasColumnType("text");

                    b.Property<DateOnly>("PostDate")
                        .HasColumnType("date");

                    b.Property<TimeOnly>("PostTime")
                        .HasColumnType("time without time zone");

                    b.Property<string>("Tags")
                        .HasColumnType("text");

                    b.Property<string>("Text")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("VisitCount")
                        .HasColumnType("integer");

                    b.HasKey("Id")
                        .HasName("Posts_pkey");

                    b.ToTable("Posts");
                });

            modelBuilder.Entity("DatabaseProvider.Models.PostsTranslation", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("FkLanguages")
                        .HasColumnType("integer");

                    b.Property<int>("FkPosts")
                        .HasColumnType("integer");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)");

                    b.Property<string>("Text")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id")
                        .HasName("PostsTranslations_pkey");

                    b.HasIndex("FkLanguages");

                    b.HasIndex("FkPosts");

                    b.ToTable("PostsTranslations");
                });

            modelBuilder.Entity("DatabaseProvider.Models.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int>("ConfirmEmail")
                        .HasColumnType("integer");

                    b.Property<string>("DateLink")
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)");

                    b.Property<int>("FkUserRoles")
                        .HasColumnType("integer");

                    b.Property<string>("Hash")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Login")
                        .IsRequired()
                        .HasMaxLength(30)
                        .HasColumnType("character varying(30)");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("character varying(255)");

                    b.Property<string>("TimeLink")
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)");

                    b.HasKey("Id")
                        .HasName("Users_pkey");

                    b.HasIndex("FkUserRoles");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("DatabaseProvider.Models.UserProfile", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("Address")
                        .HasMaxLength(255)
                        .HasColumnType("character varying(255)");

                    b.Property<string>("Avatar")
                        .HasMaxLength(255)
                        .HasColumnType("character varying(255)");

                    b.Property<string>("City")
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)");

                    b.Property<string>("Country")
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)");

                    b.Property<string>("CreateDate")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)");

                    b.Property<string>("CreateTime")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)");

                    b.Property<string>("FirstName")
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)");

                    b.Property<int>("FkUsers")
                        .HasColumnType("integer");

                    b.Property<string>("LastName")
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)");

                    b.Property<string>("MiddleName")
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)");

                    b.Property<string>("Phone")
                        .HasMaxLength(20)
                        .HasColumnType("character varying(20)");

                    b.Property<string>("StateProvince")
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)");

                    b.Property<int?>("ZipPostCode")
                        .HasColumnType("integer");

                    b.HasKey("Id")
                        .HasName("UserProfile_pkey");

                    b.HasIndex("FkUsers");

                    b.ToTable("UserProfile", (string)null);
                });

            modelBuilder.Entity("DatabaseProvider.Models.UserRole", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int>("FkAccessLevels")
                        .HasColumnType("integer");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)");

                    b.HasKey("Id")
                        .HasName("UserRoles_pkey");

                    b.HasIndex("FkAccessLevels");

                    b.ToTable("UserRoles");
                });

            modelBuilder.Entity("DatabaseProvider.Models.About", b =>
                {
                    b.HasOne("DatabaseProvider.Models.Language", "FkLanguagesNavigation")
                        .WithMany("Abouts")
                        .HasForeignKey("FkLanguages")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("About_FkLanguages_fkey");

                    b.Navigation("FkLanguagesNavigation");
                });

            modelBuilder.Entity("DatabaseProvider.Models.Contact", b =>
                {
                    b.HasOne("DatabaseProvider.Models.Language", "FkLanguagesNavigation")
                        .WithMany("Contacts")
                        .HasForeignKey("FkLanguages")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("Contacts_FkLanguages_fkey");

                    b.Navigation("FkLanguagesNavigation");
                });

            modelBuilder.Entity("DatabaseProvider.Models.PostsTranslation", b =>
                {
                    b.HasOne("DatabaseProvider.Models.Language", "FkLanguagesNavigation")
                        .WithMany("PostsTranslations")
                        .HasForeignKey("FkLanguages")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("PostsTranslations_FkLanguages_fkey");

                    b.HasOne("DatabaseProvider.Models.Post", "FkPostsNavigation")
                        .WithMany("PostsTranslations")
                        .HasForeignKey("FkPosts")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("PostsTranslations_FkPosts_fkey");

                    b.Navigation("FkLanguagesNavigation");

                    b.Navigation("FkPostsNavigation");
                });

            modelBuilder.Entity("DatabaseProvider.Models.User", b =>
                {
                    b.HasOne("DatabaseProvider.Models.UserRole", "FkUserRolesNavigation")
                        .WithMany("Users")
                        .HasForeignKey("FkUserRoles")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("Users_FkUserRoles_fkey");

                    b.Navigation("FkUserRolesNavigation");
                });

            modelBuilder.Entity("DatabaseProvider.Models.UserProfile", b =>
                {
                    b.HasOne("DatabaseProvider.Models.User", "FkUsersNavigation")
                        .WithMany("UserProfiles")
                        .HasForeignKey("FkUsers")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("UserProfile_FkUsers_fkey");

                    b.Navigation("FkUsersNavigation");
                });

            modelBuilder.Entity("DatabaseProvider.Models.UserRole", b =>
                {
                    b.HasOne("DatabaseProvider.Models.AccessLevel", "FkAccessLevelsNavigation")
                        .WithMany("UserRoles")
                        .HasForeignKey("FkAccessLevels")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("UserRoles_FkAccessLevels_fkey");

                    b.Navigation("FkAccessLevelsNavigation");
                });

            modelBuilder.Entity("DatabaseProvider.Models.AccessLevel", b =>
                {
                    b.Navigation("UserRoles");
                });

            modelBuilder.Entity("DatabaseProvider.Models.Language", b =>
                {
                    b.Navigation("Abouts");

                    b.Navigation("Contacts");

                    b.Navigation("PostsTranslations");
                });

            modelBuilder.Entity("DatabaseProvider.Models.Post", b =>
                {
                    b.Navigation("PostsTranslations");
                });

            modelBuilder.Entity("DatabaseProvider.Models.User", b =>
                {
                    b.Navigation("UserProfiles");
                });

            modelBuilder.Entity("DatabaseProvider.Models.UserRole", b =>
                {
                    b.Navigation("Users");
                });
#pragma warning restore 612, 618
        }
    }
}
