exports.addProducts = async (req, res) => {
    const productsData = req.body.products; // Assuming req.body.products is an array of products
    const products = [];
  
    try {
      if (!productsData || !Array.isArray(productsData) || productsData.length === 0) {
        return res.status(400).json({ message: "נא לספק מידע תקין על המוצרים." });
      }
  
      for (const productData of productsData) {
        const productName = escape(productData.productName);
  
        if (!productName) {
          return res.status(400).json({ message: "נא למלא את שדה המוצרים בצורה תקינה." });
        }
  
        const checkProductName = validation.addSlashes(productName);
  
        const product = await productService.addProduct(checkProductName);
        products.push(product);
      }
  
      // Assuming productService.addProduct returns the product model, you might need to adjust accordingly
  
      // Save all products
      await Promise.all(products.map(product => product.save()));
  
      return res.status(201).json({ message: "מוצרים נוספו בהצלחה.", products });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  };
  