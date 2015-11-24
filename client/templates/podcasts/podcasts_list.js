Template.podcastsList.onCreated(function () {
  var self = this;
  self.autorun(function() {
    self.subscribe('podcasts');
  })
});

Template.podcastsList.helpers({
  podcasts: function() {
    return Podcasts.find();
  }
});
