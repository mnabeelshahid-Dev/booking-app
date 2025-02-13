import { supabase } from '../config/supabase.js';

// GET API to fetch all homes
export const allHotels = async (req, res) => {
    try {
        const { page = 1, limit = 10, location, min_price, max_price, rating } = req.query;
        const offset = (page - 1) * limit;

        let query = await supabase.from("hotels").select("*", { count: "exact" });

        if (location) query = query.ilike("location", `%${location}%`);
        if (min_price) query = query.gte("price", parseFloat(min_price));
        if (max_price) query = query.lte("price", parseFloat(max_price));
        if (rating) query = query.gte("rating", parseFloat(rating));

        query = query.range(offset, offset + limit - 1);

        const { data, error, count } = query;
        if (error) throw error;

        res.status(200).json({
            success: true,
            total: count,
            currentPage: Number(page),
            totalPages: Math.ceil(count / limit),
            data,
        });
    } catch (error) {
        console.error("Error fetching hotels:", error);
        res.status(500).json({ error: "Failed to fetch hotels" });
    }
};
// insert hotles
export const createHotel = async (req, res) => {
    try {
        const { name, description, location, price, image_urls } = req.body;

        // Validate required fields
        if (!name || !location || !price) {
            return res.status(400).json({ error: "Name, location, and price are required" });
        }

        const { data, error } = await supabase.from("hotels").insert([
            { name, description, location, price, image_urls },
        ]);
        if (error) throw error;
        res.status(201).json({ message: "Hotel added successfully", data });
    } catch (error) {
        console.error("Error adding hotel:", error);
        res.status(500).json({ error: "Failed to add hotel" });
    }
}

// get a single hotel by  ID
export const getHotelDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase.from("hotels").select("*").eq("id", id).single();

        if (error || !data) return res.status(404).json({ error: "Hotel not found" });

        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching hotel:", error);
        res.status(500).json({ error: "Failed to fetch hotel" });
    }
}

export const updateHotel = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, location, price, image_urls } = req.body;

        const { data, error } = await supabase
            .from("hotels")
            .update({ name, description, location, price, image_urls })
            .eq("id", id);

        if (error || !data.length) return res.status(404).json({ error: "Hotel not found or not updated" });

        res.status(200).json({ message: "Hotel updated successfully", data });
    } catch (error) {
        console.error("Error updating hotel:", error);
        res.status(500).json({ error: "Failed to update hotel" });
    }
}

export const deleteHotel = async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase.from("hotels").delete().eq("id", id);

        if (error) return res.status(404).json({ error: "Hotel not found" });

        res.status(200).json({ message: "Hotel deleted successfully" });
    } catch (error) {
        console.error("Error deleting hotel:", error);
        res.status(500).json({ error: "Failed to delete hotel" });
    }
}