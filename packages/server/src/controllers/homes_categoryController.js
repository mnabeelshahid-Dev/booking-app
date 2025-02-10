import { supabase } from '../config/supabase.js';

// GET API to fetch all homes
export const allHomes = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('homes')
            .select('*')
            .order('created_at', { ascending: true });
        if (error) {
            console.error('Error fetching homes:', error);
            return res.status(500).json({ error: 'Error fetching homes.' });
        }
        console.log("---->>", data);

        res.status(200).json(data);
    } catch (err) {
        console.error('Server Error:', err);
        res.status(500).json({ error: 'An error occurred on the server.' });
    }
};