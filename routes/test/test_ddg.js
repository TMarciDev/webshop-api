const { image_search } = require('duckduckgo-images-api');

const router = require('express').Router();

router.get('/:q', async (req, res) => {
	try {
		let images;

		image_search({
			query: req.params.q,
			moderate: false,
			iterations: 5,
		}).then((results) => {
			images = results;
			res.status(200).send(images);
		});
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
