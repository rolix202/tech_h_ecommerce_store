import { dbQuery } from "../configs/conn.js"
import AppError from "../utils/customError.js"


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

export const fetchAllProductsQuery = async (filters) => {
    const {
        category, brand, minPrice, maxPrice, search,
        sortBy = "created_at", order = "DESC",
        page = 1, limit = 10
    } = filters;

    const offset = (page - 1) * limit;
    let queryParams = [];
    let conditions = []; 
    let queryText = `
        SELECT 
            p.id, p.name, p.description, p.unit_price, p.stock, 
            p.category, p.brand, p.created_at,
            COALESCE(json_agg(img.image_url) FILTER (WHERE img.image_url IS NOT NULL), '[]') AS images
        FROM products p
        LEFT JOIN product_images img ON p.id = img.product_id
    `;

    if (category) {
        queryParams.push(category);
        conditions.push(`p.category = $${queryParams.length}`);
    }

    if (brand) {
        queryParams.push(brand);
        conditions.push(`p.brand = $${queryParams.length}`);
    }

    if (minPrice) {
        queryParams.push(minPrice);
        conditions.push(`p.unit_price >= $${queryParams.length}`);
    }

    if (maxPrice) {
        queryParams.push(maxPrice);
        conditions.push(`p.unit_price <= $${queryParams.length}`);
    }

    if (search) {
        queryParams.push(`%${search}%`);
        conditions.push(`p.name ILIKE $${queryParams.length}`);
    }

    if (conditions.length > 0) {
        queryText += ` WHERE ${conditions.join(" AND ")}`;
    }

    queryText += `
        GROUP BY p.id
        ORDER BY ${sortBy} ${order}
        LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
    `;

    queryParams.push(limit, offset);

    try {
        const { rows } = await dbQuery(queryText, queryParams);

        const countQuery = `SELECT COUNT(*) FROM products`;
        const countResult = await dbQuery(countQuery);
        const totalCount = parseInt(countResult.rows[0].count, 10);
        const totalPages = Math.ceil(totalCount / limit);

        return {
            products: rows,
            totalPages,
            currentPage: page
        };

    } catch (error) {
        console.error("Error in fetching products at model:", error);
        throw error;
    }
};

export const checkProductExistsQuery = async (id) => {
    const queryText = `SELECT id FROM products WHERE id = $1 LIMIT 1`;
    const { rows } = await dbQuery(queryText, [id]);
    return rows.length > 0;
};


export const updateProductInforQuery = async (id, fieldsToUpdate) => {

    const keys = Object.keys(fieldsToUpdate)
    
    const queryClause = keys.map((key, index) => `${key} = $${index + 1}`).join(", ")
 

    const queryValues = keys.map((value) => fieldsToUpdate[value])

    queryValues.push(Number(id))

    const queryText = `UPDATE products SET ${queryClause}, updated_at = NOW() WHERE id = $${keys.length + 1} RETURNING *`

    try {
        const { rows } = await dbQuery(queryText, queryValues)

        return rows[0]
    } catch (error) {
        console.error("Error updating product info at product.model:", error);
        throw error;
    }
     
}


