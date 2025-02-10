import { supabase } from '../config/supabase.js';

// GET API to fetch vehicles
export const allVehicles = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('vehicles')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching vehicles:', error);
            return res.status(500).json({ error: 'Error fetching vehicles.' });
        }
        console.log("vehicles----->>>", data);

        res.status(200).json(data);
    } catch (err) {
        console.error('Server Error:', err);
        res.status(500).json({ error: 'An error occurred on the server.' });
    }
};