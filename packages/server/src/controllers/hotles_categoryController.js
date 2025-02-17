import { supabase } from '../config/supabase.js';

// GET API to fetch all homes
export const allHotels = async (req, res) => {
    try {
        const { page = 1, limit = 10, location, min_price, max_price, rating } = req.query;
        const offset = (page - 1) * limit;

        let query = supabase.from("hotels").select("*", { count: "exact" });

        if (location) query = query.ilike("location", `%${location}%`);
        if (min_price) query = query.gte("price", parseFloat(min_price));
        if (max_price) query = query.lte("price", parseFloat(max_price));
        if (rating) query = query.gte("rating", parseFloat(rating));

        query = query.range(offset, offset + limit - 1);

        const { data, error, count } = await query;
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
        const { title, description, location, price, image_urls, number_of_beds, number_of_baths, area, whatsapp_link } = req.body;

        console.log(req.body);

        // Validate required fields
        if (!title || !location || !price || !number_of_beds || !number_of_baths) {
            return res.status(400).json({ error: "title, location, price, number_of_beds, and number_of_baths are required" });
        }

        const { data, error } = await supabase.from("hotels").insert([
            { title, description, location, price, image_urls, number_of_beds, number_of_baths, area, whatsapp_link },
        ]);

        if (error) throw error;

        res.status(201).json({ message: "Hotel added successfully", data });
    } catch (error) {
        console.error("Error adding hotel:", error);
        res.status(500).json({ error: "Failed to add hotel" });
    }
};


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
        const { title, description, location, price, image_urls, number_of_beds, number_of_baths, area, whatsapp_link } = req.body;

        console.log("Request received:", req.body);

        const { data, error } = await supabase
            .from("hotels")
            .update({ title, description, location, price, image_urls, number_of_beds, number_of_baths, area, whatsapp_link })
            .eq("id", id)
            .select();

        console.log("Updated Data:", data);
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        if (!data || data.length === 0) {
            return res.status(404).json({ error: "Hotel not found or not updated" });
        }

        res.status(200).json({ message: "Hotel updated successfully", data });
    } catch (error) {
        console.error("Error updating hotel:", error);
        res.status(500).json({ error: "Failed to update hotel" });
    }
};


export const deleteHotel = async (req, res) => {
      console.log(req.params);
      
    try {
        const { id } = req.params;
        console.log(id);
        
        const { error } = await supabase.from("hotels").delete().eq("id", id);

        if (error) return res.status(404).json({ error: "Hotel not found" });

        res.status(200).json({ message: "Hotel deleted successfully" });
    } catch (error) {
        console.error("Error deleting hotel:", error);
        res.status(500).json({ error: "Failed to delete hotel" });
    }
}