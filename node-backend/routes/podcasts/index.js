const express = require('express');
const multer = require('multer');
const checkUser = require('../../middlewares/checkUser');

const schemaMiddleware = require('../../middlewares/schemaMiddleware');
const ApiError = require('../../utils/errors/ApiError');
const { podcastSchema } = require('./podcast.schema');
const {
  podcastuploader,
  getOnePodcast,
  getAllUserUploadedPodcast,
  generateAnimatedVideos,
} = require('../../controllers/podcast.controller');
const getPodcast = require('../../controllers/podcastgetter');
const podcastIdMiddleware = require('../../middlewares/podcastidstore');
const deletePodcast = require('../../controllers/podcastdeleter');
const {
  getOneAnimatedVideo,
  getAllUserCreatedAnimatedVideos,
} = require('../../controllers/animatedvideo.controller');
const podcastRouter = express.Router();

podcastRouter.get('/', checkUser, getAllUserUploadedPodcast);
podcastRouter.get('/getpodcasts', getPodcast);

podcastRouter.get('/:podcastId', checkUser, getOnePodcast);

podcastRouter.delete('/:podcastid', podcastIdMiddleware, deletePodcast);

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('audio')) {
    cb(null, true);
  } else {
    cb(new ApiError('Not an audio! Please upload only audio', 400), false);
  }
};

const storage = multer.memoryStorage();

const upload = multer({ storage, fileFilter: multerFilter });
podcastRouter.post(
  '/upload',
  checkUser,
  upload.single('podcast'),
  schemaMiddleware(podcastSchema),
  podcastuploader
);

podcastRouter.get('/download', (req, res) => {
  const { file_path } = req.body;
  res.download(file_path);
});

podcastRouter.get(
  '/:podcastId/generate-video',
  checkUser,
  getAllUserCreatedAnimatedVideos
);

podcastRouter.get(
  '/:podcastId/animated-videos/:animatedVideoId',
  checkUser,
  getOneAnimatedVideo
);

podcastRouter.get(
  '/:podcastId/animated-videos/',
  checkUser,
  generateAnimatedVideos
);

module.exports = podcastRouter;
