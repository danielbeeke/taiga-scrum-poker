Template.tablesCreate.events({
    "submit #tables-create": function (event, template) {
        event.preventDefault();
        var formState = Session.get('forms.tables-create');
        formState.project = parseInt(formState.project);

        if (formState.userstories && formState.userstories.length) {
            Meteor.call('tables-create', formState, function (error, tableId) {
                Router.go('table', {_id: tableId });
            })
        }

        return false;
    },
    "click .group-header": function (event, template) {
        if ($(event.target).next('.form-group').length) {
            var delta = $('.group-header').index(event.target);
            scrollToHeader(delta);
        }
    }
});

function scrollToHeader(delta) {
    if ($('.form-group:eq(' + delta + ')').length) {
        $('html, body').animate({
            scrollTop: $('.form-group:eq(' + delta + ')').offset().top - $('.group-header:first').outerHeight() - (delta * 35) + 'px'
        }, 600);

        setTimeout(function () {
            $('html, body').animate({
                scrollTop: $('.form-group:eq(' + delta + ')').offset().top - $('.group-header:first').outerHeight() - (delta * 35) + 'px'
            }, 600);
        }, 500)
    }
}

function hideKeyboard() {
    //this set timeout needed for case when hideKeyborad
    //is called inside of 'onfocus' event handler
    setTimeout(function() {

        //creating temp field
        var field = document.createElement('input');
        field.setAttribute('type', 'text');
        //hiding temp field from peoples eyes
        //-webkit-user-modify is nessesary for Android 4.x
        field.setAttribute('style', 'position:absolute; top: 0px; opacity: 0; -webkit-user-modify: read-write-plaintext-only; left:0px;');
        document.body.appendChild(field);

        //adding onfocus event handler for out temp field
        field.onfocus = function(){
            //this timeout of 200ms is nessasary for Android 2.3.x
            setTimeout(function() {

                field.setAttribute('style', 'display:none;');
                setTimeout(function() {
                    document.body.removeChild(field);
                    document.body.focus();
                }, 14);

            }, 200);
        };
        //focusing it
        field.focus();

    }, 50);
}

Template.tablesCreate.helpers({
    projects: function () {
        return Projects.find()
    },
    members: function () {
        var formState = Session.get('forms.tables-create');
        if (formState && formState.project) {
            Meteor.subscribe('memberships', parseInt(formState.project));

            var disciplines = [];
            formState.disciplines.forEach(function (discipline) {
                disciplines.push(parseInt(discipline));
            });

            return Memberships.find( { role: { $in: disciplines } } );
        }
    },
    userstories: function () {
        var formState = Session.get('forms.tables-create');
        if (formState && formState.project) {
            Meteor.subscribe('userstories', parseInt(formState.project));

            return UserStories.find()
        }
    },
    groupClasses: function (name) {
        var formState = Session.get('forms.tables-create');
        if (formState && formState[name]) {
            return 'allowed';
        }
    },
    disciplines: function () {
        var formState = Session.get('forms.tables-create');
        if (formState && formState.project) {
            Meteor.subscribe('projectdetails', parseInt(formState.project));

            var currentProject = ProjectDetails.findOne({id: parseInt(formState.project)});

            if (currentProject && currentProject.roles) {
                return currentProject.roles;
            }
        }
    }
});

Template.tablesCreate.rendered = function () {
    var curDown = false,
        curYPos = 0,
        curXPos = 0;
    $(window).mousemove(function(m){
        if(curDown === true){
            $(window).scrollTop($(window).scrollTop() + (curYPos - m.pageY));
            $(window).scrollLeft($(window).scrollLeft() + (curXPos - m.pageX));
        }
    });

    $(window).mousedown(function(m){
        curDown = true;
        curYPos = m.pageY;
        curXPos = m.pageX;
    });

    $(window).mouseup(function(){
        curDown = false;
    });

    $(document).on('keypress', function (event) {
        if (event.keyCode == 13) {
            var newDelta;
            if ($('.group-header.sticky:last').length) {
                newDelta = $('.group-header').index($('.group-header.sticky:last').nextAll('.group-header:first')[0]);
            }
            else {
                newDelta = 1;
            }

            scrollToHeader(newDelta);

            hideKeyboard($('input'))
        }
    });

    $(window).on('scroll', function () {
        $('.form-group').each(function (delta, group) {
            var header = $(group).prev('.group-header');
            var deltaAdjustment = delta * 36;

            if ($(group).offset().top - $(header).outerHeight() - deltaAdjustment < $(window).scrollTop()) {
                $(header).addClass('sticky');
            }
            else if ($(group).offset().top + deltaAdjustment > $(window).scrollTop()) {
                $(header).removeClass('sticky');
            }
        })
    })
}