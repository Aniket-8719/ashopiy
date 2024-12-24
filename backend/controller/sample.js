const generateUniqueShopkeeperId = async () => {
    let unique = false;
    let shopkeeperId;
  
    while (!unique) {
      shopkeeperId = "SHP-" + Math.floor(100000 + Math.random() * 900000); // Generate 6-digit random number
      const exists = await ShopkeeperModel.findOne({ shopkeeperId }); // Check in the database
      if (!exists) unique = true; // If no conflict, mark as unique
    }
  
    return shopkeeperId;
  };
  
  // Usage Example
  const createShopkeeper = async (req, res) => {
    try {
      const shopkeeperId = await generateUniqueShopkeeperId(); // Ensure unique ID
      const newShopkeeper = new ShopkeeperModel({
        name: req.body.name,
        email: req.body.email,
        shopkeeperId: shopkeeperId, // Assign unique shopkeeperId
      });
  
      await newShopkeeper.save();
      res.status(201).json({ message: "Shopkeeper created successfully", shopkeeperId });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  };

  
