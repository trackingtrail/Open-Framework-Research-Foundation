const Solution = require('../../models/Solution');
const jwt = require('jsonwebtoken');

const solutionController = {
    async create(req, res) {
        try {
            // Extract the JWT from the cookie
            const token = req.cookies['user-session-token'];
            if (!token) {
                return res.status(401).json({ message: 'No token provided, cannot identify solver' });
            }

            // Decode the JWT to get the solverId
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const solverId = decoded.solverId;

            if (!solverId) {
                return res.status(400).json({ message: 'Unable to identify solver from token' });
            }

            // Extract the problemId from the URL parameter
            const { problemId } = req.params;
            if (!problemId) {
                return res.status(400).json({ message: 'Problem ID is required' });
            }

            // Extract solution details from the request body
            const { solutionTitle, solutionDescription } = req.body;

            // Create a new solution record
            const newSolution = await Solution.create({
                solverId,
                problemId,
                solutionTitle,
                solutionDescription
            });

            res.status(201).json({
                message: 'Solution submitted successfully',
                solution: newSolution
            });

        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Invalid token' });
            }
            res.status(500).json({ message: 'Error submitting solution', error: error.message });
        }
    }
};

module.exports = solutionController;