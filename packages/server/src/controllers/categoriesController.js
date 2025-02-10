import { supabase } from '../config/supabase.js';

// GET API to fetch categories
export const allCategories = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching categories:', error);
            return res.status(500).json({ error: 'Error fetching categories.' });
        }

        res.status(200).json(data);
    } catch (err) {
        console.error('Server Error:', err);
        res.status(500).json({ error: 'An error occurred on the server.' });
    }
};

// GET /availableCategories?from_date=2025-01-01&to_date=2025-01-10
export const categoriesWithSubcategories = async (req, res) => {
    try {
        const { from_date, to_date } = req.query;

        if (!from_date || !to_date) {
            return res.status(400).json({ error: 'Both from_date and to_date are required.' });
        }

        // Fetch categories and their subcategories with date filtering
        const { data, error } = await supabase
            .from('categories')
            .select(`
                *,
                subcategories (
                    *
                )
            `)
            .eq('subcategories.available', true) // Optional: If a boolean flag for availability exists
            .gte('subcategories.available_from', from_date)
            .lte('subcategories.available_to', to_date)
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching categories with subcategories:', error);
            return res.status(500).json({ error: 'Error fetching data.' });
        }

        res.status(200).json(data); // Return categories with their filtered subcategories
    } catch (err) {
        console.error('Server Error:', err);
        res.status(500).json({ error: 'An error occurred on the server.' });
    }
};



