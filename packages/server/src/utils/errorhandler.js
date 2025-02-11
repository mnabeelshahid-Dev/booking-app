export const handleError = (res, error, defaultMessage = 'An error occurred.') => {
    console.error(error);
    if (error.message.includes('already exists')) {
        return res.status(400).json({ error: 'Email already exists.' });
    } else if (error.message.includes('not found')) {
        return res.status(400).json({ error: 'Email not found.' });
    } else if (error.message.includes('Invalid email or password')) {
        return res.status(401).json({ error: 'Invalid email or password.' });
    }
    return res.status(500).json({ error: defaultMessage });
};
