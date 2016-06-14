Template.commentSubmit.onCreated( function() {
  Session.set('commentSubmitErrors', {});
});

Template.commentSubmit.helpers({
  errorMessage: function(field) {
    return Session.get('commentSubmitErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('commentSubmitErrors')[field] ? 'has-error' : '';
  }
});

Template.commentSubmit.events({
  'submit form': function(e, template) {
    e.preventDefault();

    var $body = $(e.target).find('[name=body]');
    var postId = null;

    // not an ideal solution; i'm just having trouble w/ parent Template data.
    switch(FlowRouter.getRouteName()) {
      case "partyPage":
          postId = Parties.findOne()._id;
          break;
      case "newsPage":
          postId = Posts.findOne()._id;
          break;
      case "podcastPage":
          var epNum = FlowRouter.getParam('episodeNumber');
          
          postId = Podcasts.findOne({ episodeNumber: Number(epNum) })._id;
          break;
      default:
          throwError("Cannot comment on this page!");
          return;
    };

    var comment = {
      body: $body.val(),
      postId: postId,
      type: FlowRouter.getRouteName()
    };
    var errors = {};
    if (! comment.body) {
      errors.body = "Please write something";
      return Session.set('commentSubmitErrors', errors);
    }
    Meteor.call('commentInsert', comment, function(error, commentId) {
      if (error){
        throwError(error.reason, {type: 'danger'});
      } else {
        $body.val('');
      }
    });
  }
});
