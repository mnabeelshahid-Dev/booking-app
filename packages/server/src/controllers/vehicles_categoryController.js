import { supabase } from '../config/supabase.js';

// GET API to fetch vehicles
export const allVehicles = async (req, res) => {
    try {
        const { page = 1, limit = 10, location, min_price, max_price, model } = req.query;
        const offset = (page - 1) * limit;

        let query = supabase.from("vehicles").select("*", { count: "exact" });

        // Apply filters dynamically
        if (location) query = query.ilike("location", `%${location}%`); // Case-insensitive search
        if (min_price) query = query.gte("price", parseFloat(min_price)); // Min price filter
        if (max_price) query = query.lte("price", parseFloat(max_price)); // Max price filter
        if (model) query = query.eq("model", model); // Exact match for model

        query = query.order("created_at", { ascending: false }) // Newest vehicles first
            .range(offset, offset + limit - 1); // Pagination

        // Execute query
        const { data, error, count } = await query;
        if (error) throw error;

        res.status(200).json({
            success: true,
            total: count,
            currentPage: Number(page),
            totalPages: Math.ceil(count / limit),
            data,
        });
    } catch (err) {
        console.error("Error fetching vehicles:", err);
        res.status(500).json({ error: "An error occurred on the server." });
    }
};

// insert new vehicles
export const addVehicle = async (req, res) => {
    try {
        const { name, description, model, location, price, km_used, image_urls } = req.body;

        if (!name || !model || !location || !price || !km_used) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        // Insert vehicle
        const { data, error } = await supabase
            .from("vehicles")
            .insert([{ name, description, model, location, price, km_used, image_urls }])
            .select("*");

        if (error) throw error;
        res.status(201).json({ success: true, message: "Vehicle added successfully", data });
    } catch (err) {
        console.error("Error adding vehicle:", err);
        res.status(500).json({ error: "Failed to add vehicle" });
    }
};

//delete Vehicles
export const deleteVehicle = async (req, res) => {
    try {
        const { id } = req.params;

        const { data: existingVehicle, error: findError } = await supabase
            .from("vehicles")
            .select("*")
            .eq("id", id)
            .single();

        if (findError || !existingVehicle) {
            return res.status(404).json({ error: "Vehicle not found" });
        }

        const { error } = await supabase
            .from("vehicles")
            .delete()
            .eq("id", id);

        if (error) throw error;

        res.status(200).json({ success: true, message: "Vehicle deleted successfully" });
    } catch (err) {
        console.error("Error deleting vehicle:", err);
        res.status(500).json({ error: "Failed to delete vehicle" });
    }
};

// update Vehicles

export const updateVehicle = async (req, res) => {
      console.log(req);
      
    try {
        const { id } = req.params;
        const updates = req.body;

        const { data: existingVehicle, error: findError } = await supabase
            .from("vehicles")
            .select("*")
            .eq("id", id)
            .single();

        if (findError || !existingVehicle) {
            return res.status(404).json({ error: "Vehicle not found" });
        }

        const { data, error } = await supabase
            .from("vehicles")
            .update(updates)
            .eq("id", id)
            .select("*");

        if (error) throw error;

        res.status(200).json({ success: true, message: "Vehicle updated successfully", data });
    } catch (err) {
        console.error("Error updating vehicle:", err);
        res.status(500).json({ error: "Failed to update vehicle" });
    }
};



