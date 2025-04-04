import mongoose from 'mongoose'
import config from './index.js'

/**
 * Connect to MongoDB database
 */
const connectDB = async () => {
	try {
		const conn = await mongoose.connect(config.db.url, {
			// These options are no longer required in newer Mongoose versions but kept for compatibility
			useNewUrlParser: true,
			useUnifiedTopology: true
		})

		console.log(`MongoDB Connected: ${conn.connection.host}`)
	} catch (error) {
		console.error(`Error: ${error.message}`)
		process.exit(1)
	}
}

export default connectDB
