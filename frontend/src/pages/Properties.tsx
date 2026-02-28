import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import PropertyCard from "../components/properties/PropertyCart";
import PropertyFilters from "@/components/properties/PropertyFilters";
import { useData } from "@/context/dataContext";

const Properties = () => {
  const { properties } = useData();

  return (
    <>
      <Helmet>
        <title>Explore Properties | PropGrowthX</title>
        <meta
          name="description"
          content="Browse verified properties for sale, rent, or lease. Filter by price, location, and more with PropGrowthX's intelligent property search."
        />
      </Helmet>

      <Layout>
        {/* Header */}
        <section className="bg-gradient-to-br from-primary to-secondary py-16 lg:py-24">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center text-primary-foreground">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Explore Properties
              </h1>
              <p className="text-lg text-primary-foreground/80">
                Discover verified properties with detailed analytics, ML-powered
                valuations, and comprehensive market data.
              </p>
            </div>
          </div>
        </section>

        {/* Filters & Properties */}
        <section className="py-12 lg:py-16 bg-background">
          <div className="container-custom">
            {/* Filters */}
            <div className="mb-8">
              <PropertyFilters />
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {properties.length}
                </span>{" "}
                properties
              </p>
            </div>

            {/* Properties Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {properties.map((property, index) => (
                <PropertyCard key={index} {...property} />
              ))}
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Properties;
