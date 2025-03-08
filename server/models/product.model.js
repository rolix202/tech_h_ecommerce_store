

export const insertProductDetails = async (client, data) => {
    const { name, description, unit_price, stock, category, brand } = data

    let queryText = `INSERT INTO products (name, description, unit_price, stock, category, brand) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`

    const { rows } = await client.query(queryText, [name, description, unit_price, stock, category, brand])

    return rows[0]

}

export const insertProductImages = async (client, productId, productImages) => {

    if (!productImages || productImages.length === 0) return;

    let queryText = `INSERT INTO product_images (product_id, image_url) VALUES ${productImages.map((_, index) => `($1, $${index + 2})`).join(",")}`

    const { rows } = await client.query(queryText, [productId, ...productImages])

    return rows[0]
}