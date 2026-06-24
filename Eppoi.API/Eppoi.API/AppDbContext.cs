using System;
using System.Collections.Generic;
using Eppoi.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace Eppoi.API;

public partial class AppDbContext : DbContext
{
    public AppDbContext()
    {
    }

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Article> Articles { get; set; }
    public virtual DbSet<ArticleParagraph> ArticleParagraphs { get; set; }
    public virtual DbSet<Booking> Bookings { get; set; }
    public virtual DbSet<CarPark> CarParks { get; set; }
    public virtual DbSet<Catalogue> Catalogues { get; set; }
    public virtual DbSet<CreativeWork> CreativeWorks { get; set; }
    public virtual DbSet<CulturalProject> CulturalProjects { get; set; }
    public virtual DbSet<Municipality> Municipalities { get; set; }
    public virtual DbSet<Offer> Offers { get; set; }
    public virtual DbSet<OpeningHour> OpeningHours { get; set; }
    public virtual DbSet<Organization> Organizations { get; set; }
    public virtual DbSet<Poi> Pois { get; set; }
    public virtual DbSet<PoisArtCultureNature> PoisArtCultureNatures { get; set; }
    public virtual DbSet<PoisEatAndDrink> PoisEatAndDrinks { get; set; }
    public virtual DbSet<PoisEntertainmentLeisure> PoisEntertainmentLeisures { get; set; }
    public virtual DbSet<PoisEvent> PoisEvents { get; set; }
    public virtual DbSet<PoisShopping> PoisShoppings { get; set; }
    public virtual DbSet<PoisSleep> PoisSleeps { get; set; }
    public virtual DbSet<Entities.Route> Routes { get; set; }
    public virtual DbSet<RouteStage> RouteStages { get; set; }
    public virtual DbSet<Service> Services { get; set; }
    public virtual DbSet<Site> Sites { get; set; }
    public virtual DbSet<TemporaryClosure> TemporaryClosures { get; set; }
    public virtual DbSet<TimeInterval> TimeIntervals { get; set; }
    public virtual DbSet<TypicalProduct> TypicalProducts { get; set; }
    public virtual DbSet<User> Users { get; set; }
    public virtual DbSet<UserPreference> UserPreference { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .HasPostgresEnum("Role", new[] { "Tourist", "Admin" })
            .HasPostgresEnum("admission_type_enum", new[] { "Daily", "Weekly", "Monthly" })
            .HasPostgresEnum("auth", "aal_level", new[] { "aal1", "aal2", "aal3" })
            .HasPostgresEnum("auth", "code_challenge_method", new[] { "s256", "plain" })
            .HasPostgresEnum("auth", "factor_status", new[] { "unverified", "verified" })
            .HasPostgresEnum("auth", "factor_type", new[] { "totp", "webauthn", "phone" })
            .HasPostgresEnum("auth", "oauth_authorization_status", new[] { "pending", "approved", "denied", "expired" })
            .HasPostgresEnum("auth", "oauth_client_type", new[] { "public", "confidential" })
            .HasPostgresEnum("auth", "oauth_registration_type", new[] { "dynamic", "manual" })
            .HasPostgresEnum("auth", "oauth_response_type", new[] { "code" })
            .HasPostgresEnum("auth", "one_time_token_type", new[] { "confirmation_token", "reauthentication_token", "recovery_token", "email_change_token_new", "email_change_token_current", "phone_change_token" })
            .HasPostgresEnum("booking_type_enum", new[] { "Mandatory", "Optional", "None" })
            .HasPostgresEnum("currency_enum", new[] { "EUR" })
            .HasPostgresEnum("day_of_week_enum", new[] { "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" })
            .HasPostgresEnum("realtime", "action", new[] { "INSERT", "UPDATE", "DELETE", "TRUNCATE", "ERROR" })
            .HasPostgresEnum("realtime", "equality_op", new[] { "eq", "neq", "lt", "lte", "gt", "gte", "in" })
            .HasPostgresEnum("storage", "buckettype", new[] { "STANDARD", "ANALYTICS", "VECTOR" })
            .HasPostgresExtension("extensions", "pg_stat_statements")
            .HasPostgresExtension("extensions", "pgcrypto")
            .HasPostgresExtension("extensions", "uuid-ossp")
            .HasPostgresExtension("graphql", "pg_graphql")
            .HasPostgresExtension("vector")
            .HasPostgresExtension("vault", "supabase_vault");

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("User_pkey");

            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");
            entity.Property(e => e.HasCompletedFirstLogin).HasDefaultValue(false);
            entity.Property(e => e.PreferredTravelMethod).HasComment("The user preferred traveling method");
            entity.Property(e => e.PreferredTravelStyle).HasComment("The user preferred traveling style (e.g., Solo, Family)");
        });

        modelBuilder.Entity<Article>(entity =>
        {
            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("now()");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("now()");

            entity.HasOne(d => d.Municipality).WithMany(p => p.Articles).OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<ArticleParagraph>(entity =>
        {
            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("now()");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("now()");

            entity.HasOne(d => d.Article).WithMany(p => p.ArticleParagraphs).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Booking>(entity =>
        {
            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("now()");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("now()");

            entity.HasOne(d => d.Poi).WithMany(p => p.Bookings).OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(d => d.PoiNavigation).WithMany(p => p.Bookings).OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(d => d.Poi1).WithMany(p => p.Bookings).OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(d => d.ServicePoi).WithMany(p => p.Bookings).OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(d => d.TimeInterval).WithMany(p => p.Bookings).OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<CarPark>(entity =>
        {
            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");
        });

        modelBuilder.Entity<Catalogue>(entity =>
        {
            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("now()");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("now()");

            entity.HasOne(d => d.ArtCultureNaturePoi).WithMany(p => p.Catalogues).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<CreativeWork>(entity =>
        {
            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("now()");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("now()");

            entity.HasOne(d => d.ArtCultureNaturePoi).WithMany(p => p.CreativeWorks).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<CulturalProject>(entity =>
        {
            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("now()");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("now()");

            entity.HasOne(d => d.ArtCultureNaturePoi).WithMany(p => p.CulturalProjects)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_cultural_projects_pois_art_culture_nature_artCultureNatureP~");
        });

        modelBuilder.Entity<Municipality>(entity =>
        {
            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");
        });

        modelBuilder.Entity<Offer>(entity =>
        {
            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("now()");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("now()");

            entity.HasOne(d => d.EventPoi).WithMany(p => p.Offers).OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(d => d.SleepPoi).WithMany(p => p.Offers).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<OpeningHour>(entity =>
        {
            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("now()");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("now()");

            entity.HasOne(d => d.TimeInterval).WithMany(p => p.OpeningHours).OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Organization>(entity =>
        {
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("now()");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("now()");

            entity.HasOne(d => d.Municipality).WithMany(p => p.Organizations).OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Poi>(entity =>
        {
            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("now()");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("now()");

            entity.HasOne(d => d.Municipality).WithMany(p => p.Pois).OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(d => d.OwnerTaxCodeNavigation).WithMany(p => p.Pois).OnDelete(DeleteBehavior.SetNull);

            entity.HasMany(d => d.Services).WithMany(p => p.Pois)
                .UsingEntity<Dictionary<string, object>>(
                    "PoiService",
                    r => r.HasOne<Service>().WithMany().HasForeignKey("ServicesId"),
                    l => l.HasOne<Poi>().WithMany().HasForeignKey("PoisId"),
                    j =>
                    {
                        j.HasKey("PoisId", "ServicesId");
                        j.ToTable("poi_services");
                        j.HasIndex(new[] { "ServicesId" }, "IX_poi_services_ServicesId");
                    });
        });

        modelBuilder.Entity<PoisArtCultureNature>(entity =>
        {
            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");

            entity.HasOne(d => d.Site).WithMany(p => p.PoisArtCultureNatures).OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<PoisEatAndDrink>(entity =>
        {
            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");

            entity.HasOne(d => d.OpeningHours).WithMany(p => p.PoisEatAndDrinks).OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(d => d.TemporaryClosure).WithMany(p => p.PoisEatAndDrinks).OnDelete(DeleteBehavior.SetNull);

            entity.HasMany(d => d.TypicalProducts).WithMany(p => p.EatAndDrinkPois)
                .UsingEntity<Dictionary<string, object>>(
                    "EatAndDrinkPoiTypicalProduct",
                    r => r.HasOne<TypicalProduct>().WithMany()
                        .HasForeignKey("TypicalProductsId")
                        .HasConstraintName("FK_eat_and_drink_poi_typical_products_typical_products_Typical~"),
                    l => l.HasOne<PoisEatAndDrink>().WithMany()
                        .HasForeignKey("EatAndDrinkPoiId")
                        .HasConstraintName("FK_eat_and_drink_poi_typical_products_pois_eat_and_drink_EatAn~"),
                    j =>
                    {
                        j.HasKey("EatAndDrinkPoiId", "TypicalProductsId");
                        j.ToTable("eat_and_drink_poi_typical_products");
                        j.HasIndex(new[] { "TypicalProductsId" }, "IX_eat_and_drink_poi_typical_products_TypicalProductsId");
                    });
        });

        modelBuilder.Entity<PoisEntertainmentLeisure>(entity =>
        {
            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");
        });

        modelBuilder.Entity<PoisEvent>(entity =>
        {
            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");

            entity.HasOne(d => d.OrganizerTaxCodeNavigation).WithMany(p => p.PoisEvents).OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<PoisShopping>(entity =>
        {
            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");

            entity.HasOne(d => d.OpeningHours).WithMany(p => p.PoisShoppings).OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(d => d.TemporaryClosure).WithMany(p => p.PoisShoppings).OnDelete(DeleteBehavior.SetNull);

            entity.HasMany(d => d.TypicalProducts).WithMany(p => p.ShoppingPois)
                .UsingEntity<Dictionary<string, object>>(
                    "ShoppingTypicalProduct",
                    r => r.HasOne<TypicalProduct>().WithMany().HasForeignKey("TypicalProductsId"),
                    l => l.HasOne<PoisShopping>().WithMany().HasForeignKey("ShoppingPoiId"),
                    j =>
                    {
                        j.HasKey("ShoppingPoiId", "TypicalProductsId");
                        j.ToTable("shopping_typical_products");
                        j.HasIndex(new[] { "TypicalProductsId" }, "IX_shopping_typical_products_TypicalProductsId");
                    });
        });

        modelBuilder.Entity<PoisSleep>(entity =>
        {
            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");

            entity.HasOne(d => d.OpeningHours).WithMany(p => p.PoisSleeps).OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(d => d.TemporaryClosure).WithMany(p => p.PoisSleeps).OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Entities.Route>(entity =>
        {
            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("now()");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("now()");

            entity.HasOne(d => d.Municipality).WithMany(p => p.Routes).OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<RouteStage>(entity =>
        {
            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("now()");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("now()");

            entity.HasOne(d => d.Poi).WithMany(p => p.RouteStages).OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Service>(entity =>
        {
            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("now()");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("now()");

            entity.HasOne(d => d.Municipality).WithMany(p => p.Services).OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(d => d.OpeningHours).WithMany(p => p.Services).OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(d => d.TemporaryClosure).WithMany(p => p.Services).OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Site>(entity =>
        {
            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");
        });

        modelBuilder.Entity<TemporaryClosure>(entity =>
        {
            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("now()");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("now()");

            entity.HasOne(d => d.TimeInterval).WithMany(p => p.TemporaryClosures).OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<TimeInterval>(entity =>
        {
            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");
        });

        modelBuilder.Entity<TypicalProduct>(entity =>
        {
            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");
        });

        modelBuilder.Entity<UserPreference>(entity =>
        {
            entity.HasKey(e => e.Id);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
