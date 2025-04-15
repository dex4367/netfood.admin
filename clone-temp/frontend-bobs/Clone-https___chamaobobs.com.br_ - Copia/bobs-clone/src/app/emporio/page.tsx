import { ProductCategory } from "@/components/ui/product-category";

export default function EmporioPage() {
  // Empório Bob's products data based on the provided example
  const emporioCategory = {
    id: 1,
    name: "Empório Bob´s",
    products: [
      {
        id: 1,
        name: "Molho Bob's Burger & Salad",
        description: "Ele é único e exclusivo! Receita autêntica criada em nossa cozinha deixando seu sanduíche ainda mais...",
        price: "21,90",
        photo: "https://storage.shopfood.io/public/companies/poe726g0/products/medium/202210040945_HE15_i.jpg"
      },
      {
        id: 2,
        name: "Molho Big Bob 200g",
        description: "Ele é único e exclusivo! Aprecie o verdadeiro Molho Big Bob e deixe seu sanduíche ainda mais saboroso. Que tal abusar da criatividade para criar novas combinações? Imagina mergulhar aquela batatinha f",
        price: "21,90",
        photo: "https://storage.shopfood.io/public/companies/poe726g0/products/medium/202111041746_78R8_i.jpg"
      }
    ]
  };

  return (
    <div className="container px-4 py-6 mx-auto">
      <ProductCategory category={emporioCategory} />
    </div>
  );
} 