import { ENDPOINTS } from "./EndPoints.js";

export class ProductsService {
  async Get_Products_By_Name(productName) {
    const response = await fetch(
      ENDPOINTS.PRODUCTS.Get_Products_By_Name(productName),
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch products: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    return data.results;
  }

  async Get_Product_By_Barcode(productBarcode) {
    const response = await fetch(
      ENDPOINTS.PRODUCTS.Get_Product_By_Barcode(productBarcode),
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch product: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    return data.result;
  }

  async Get_All_Product_Categories() {
    const response = await fetch(ENDPOINTS.PRODUCTS.Get_All_Product_Categories);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch categories: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    return data.results;
  }
  
  async Get_Products_By_Category(category) {
    const response = await fetch(ENDPOINTS.PRODUCTS.Get_Products_By_Category(category));

    if (!response.ok) {
      throw new Error(
        `Failed to fetch products: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    return data.results;
  }
}
