
const Heart = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16"><path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"/></svg>';
const HeartFilled = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/></svg>'

export function loadPosts(filter, page) {
    console.log(`Loading posts // filter = ${filter} // page = ${page}`);

    const user_id = document.querySelector('#user_authenticated');

    const header = document.querySelector('#posts_block_header');

    // clear the post block to avoid dublicates
    document.querySelector('#posts_block').innerHTML = '';

    // clear the pagination block if exisited
    const pagination_block = document.querySelector('#posts_pagination_nav');
    if (pagination_block) {
        pagination_block.innerHTML = '';
    };

    // dispay correct header msg
    if (filter == 'all') {
        header.innerHTML = "All posts";
    } else {
        if (filter == 'following') {
            header.innerHTML = "Post of people you follow";
        } else {
            header.innerHTML = "";
        };
    };


    // Get Posts from DB
    fetch(`/view?filter=${filter}&page=${page}`)
        .then(response => {
            return response.json();
        })
        .then(data => {
            // display posts
            console.log("All Posts loaded from back end:", data);
            data.posts.forEach(post => loadFullPostInfo(post));

            // display pagination
            if (data.num_pages > 1) {
                PaginatePosts(data.current_page, data.num_pages, filter);
            };

            //edit buttion if clicked if any
            let edit_links = document.querySelectorAll('.edit_link');
            if (edit_links) {
                edit_links.forEach(edit_link => {
                    edit_link.addEventListener('click', Edit);
                });
            };

            if (user_id) {
                let like_icons = document.querySelectorAll('.heart');
                like_icons.forEach(like_icon => {
                    like_icon.addEventListener('click', LikePost)
                });
            };

        })
        .catch(error => {
            console.error('Error uploading posts:', error);
        });


};

export function loadFullPostInfo(post) {

    const user_current_id = document.querySelector('#user_authenticated');

    //create a post container
    const single_post_block = document.createElement('div');
    single_post_block.className = 'single_post_block';

    //load a post Creator (by usermane)
    const CreatorDiv = document.createElement('div');
    CreatorDiv.className = 'creator';
    //CreatorDiv.textContent = post.creator;

    const CreatorLink = document.createElement('a');
    CreatorLink.href = `/profile/${post.creator}`;
    CreatorLink.textContent = post.creator;

    CreatorDiv.append(CreatorLink);

    //load a post Text
    const PostTextDiv = document.createElement('div');
    PostTextDiv.className = 'post_text';
    PostTextDiv.id = `post_text_${post.id}`;
    PostTextDiv.textContent = post.post_text;

    //create container for Other (likes, timestamp...)
    const OtherDiv = document.createElement('div');
    OtherDiv.className = 'other';

    //load likes
    const LikesDiv = document.createElement('div');
    LikesDiv.className = 'likes';

    // load a like button / icon
    const HeartDiv = document.createElement('a');
    HeartDiv.className = 'heart';
    HeartDiv.id = `heart_${post.id}`;
    HeartDiv.dataset.postId = post.id;
    HeartDiv.href = "";
    if (!user_current_id) {
        HeartDiv.style.pointerEvents = "none";
    };

    HeartDiv.innerHTML = Heart;
    
    if (user_current_id) {
        isPostLiked(post.id).then(isLiked => {
            if (isLiked) {
              HeartDiv.innerHTML = HeartFilled;
            };
          });
    };

    // load a like count
    const LikesCount = document.createElement('div');
    LikesCount.className = 'likes_count';
    LikesCount.id = `likes_count_${post.id}`;
    LikesCount.dataset.postId = post.id;
    LikesCount.textContent = `${post.like_count}`;
   
    LikesDiv.append(HeartDiv, LikesCount); 

    //load a timestamp
    const TimestampDiv = document.createElement('div');
    TimestampDiv.className = 'timestamp';
    TimestampDiv.textContent = post.timestamp;

    //display Other container
    OtherDiv.append(LikesDiv, TimestampDiv);

    // Add Edit link if applicable
    // check if the post belongs the authenticated user
    
   
    if (user_current_id) {

        if (parseInt(user_current_id.innerHTML) === post.creator_id) {
            // dispay the Edit link
            const EditDiv = document.createElement('a');
            EditDiv.className = 'edit_link';
            EditDiv.href = "";
            EditDiv.textContent = 'edit';
            EditDiv.dataset.postId = post.id;
            OtherDiv.append(EditDiv);
        }
    };

    // display Post container
    single_post_block.append(CreatorDiv, PostTextDiv, OtherDiv);

    // dispay posts (latest on top)
    document.querySelector('#posts_block').append(single_post_block);
};


function PaginatePosts(current_page, num_pages, filter) {

    // create PREV button if applicable
    if (current_page > 1) {
        const PrevLink = document.createElement('a');
        PrevLink.className = 'posts_pagination_nav_block';
        PrevLink.id = 'prev_link';
        PrevLink.href = "";
        PrevLink.textContent = '\u00AB previous';
        // display Prev button
        document.querySelector('#posts_pagination_nav').append(PrevLink);
        // when it ckicked!
        PrevLink.addEventListener('click', function(event) {
            console.log("prev button is clicked");
            event.preventDefault();
            let prev_page = current_page - 1;
            loadPosts(filter, prev_page);
        });
    };

    // create Page Count Msg
    const PageCountDiv = document.createElement('span');
    PageCountDiv.className = 'posts_pagination_nav_block';
    PageCountDiv.textContent = `Page ${current_page} of ${num_pages}`;
    // dispay Page Count Msg
    document.querySelector('#posts_pagination_nav').append(PageCountDiv);

    //create NEXT button if applicable
    if (current_page < num_pages) {
        const NextLink = document.createElement('a');
        NextLink.id = 'next_link';
        NextLink.className = 'posts_pagination_nav_block';
        NextLink.href = "";
        NextLink.textContent = 'next \u00BB';
        // display NEXT button
        document.querySelector('#posts_pagination_nav').append(NextLink);
        // when it ckicked!
        NextLink.addEventListener('click', function(event) {
            console.log("next button is clicked");
            event.preventDefault();
            let next_page = current_page + 1;
            loadPosts(filter, next_page);
        });
    };
};


export async function savePost(event) {

    console.log('New Post Submit button is clicked)');
    // Prevent default submission of the post
    event.preventDefault()

    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    const user_input = document.querySelector('#form_post_text').value;

    // Submit form

    const headers = {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken,
    };
    const body = JSON.stringify({
        post_text: user_input,
    });

    let response;

    try {
        response = await fetch('/new', {
            method: 'POST',
            headers: headers,
            body: body,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log(`Body: ${body}`);
        console.log("Response", await response.json());

        return response;
    } catch (error) {
        console.log("Body", body);
        console.log("Response", response);
        console.log('Error:', error);
    }
};

export function Edit(event) {
    event.preventDefault();
    
    const postId = this.dataset.postId;
    console.log(`edit button for post ${postId} clicked`);
    const PostToEditDiv = document.querySelector(`#post_text_${postId}`);

    // hide edit link
    this.style.visibility = 'hidden';

    // clear the post_text field before adding a form
    const PostTextToEdit = PostToEditDiv.textContent;
    PostToEditDiv.innerHTML = '';

    // substitute display with a form
    const EditForm = document.createElement('form');
    EditForm.method = 'post';
    EditForm.action = '/edit';

    const EditInput = document.createElement('textarea');
    EditInput.className = 'edit_post_input';
    EditInput.setAttribute('row', '2');
    EditInput.setAttribute('maxlength', '140');
    EditInput.textContent = PostTextToEdit;

    const SaveEditButton = document.createElement('button');
    SaveEditButton.textContent = 'Save changes';

    EditForm.append(EditInput, SaveEditButton);
    PostToEditDiv.append(EditForm);

    SaveEditButton.addEventListener('click', function(event) {
        event.preventDefault();
        console.log(`SaveEditButton for post ${postId} is clicked`);

        //get tocken value
        const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;

        //get updated text input value
        const new_post_input = EditInput.value;

        //prepare for fetching
        const headers = {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        };
        const body = JSON.stringify({
            id: postId,
            post_text: new_post_input,
        });

        console.log("body:", body);
        
        // try fetshing
        fetch('/edit', {
            method: 'POST',
            headers: headers,
            body: body,
        }) 
        .then(response => response.json())
        .then(result => {
            // Print result
            // unhide edit link
            console.log(result);
            document.querySelector(`.edit_link[data-post-id="${postId}"]`).style.visibility = 'visible';
            PostToEditDiv.innerHTML = '';
            PostToEditDiv.textContent = new_post_input;

        })
        .catch(error => {
            console.log('Error:', error);
        });

    });
};


export async function FollowFunction(event) {
    console.log('Follow/Unfollow button is clicked');
    // Prevent default submission of the post
    event.preventDefault()

    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    const user_profile_id = document.querySelector('#user_profile_id').value;
    
    // Send JSON data to back-end 

    const headers = {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken,
    };
    const body = JSON.stringify({
        user_profile_id: user_profile_id,
    });

    let response;

    try {
        response = await fetch('/follow', {
            method: 'POST',
            headers: headers,
            body: body,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log("Response", await response.json());

        return response;
    } catch (error) {
        console.log("Body", body);
        console.log("Response", response);
        console.log('Error:', error);
    }

};

function isPostLiked(post_id) {
    return fetch(`/likecheck?post_id=${post_id}`)
      .then(response => response.json())
      .then(data => {
        return data.like_exists;
      })
      .catch(error => {
        console.error('Error with DisplayLikeIcon on backend', error);
        return false; // or handle the error as needed
      });
  };

function LikePost(event) {
    event.preventDefault();
    const postId = this.dataset.postId;
    console.log(`LikePostButton for post ${postId} is clicked`);

    let likes_count = parseInt(document.querySelector(`#likes_count_${postId}`).innerHTML);

    //get tocken value
    const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;

    //prepare for fetching
    const headers = {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
    };
    const body = JSON.stringify({
        id: postId
    });

    // try fetshing
    fetch('/like', {
        method: 'POST',
        headers: headers,
        body: body,
    }) 
    .then(response => response.json())
    .then(result => {
        // Print result
        console.log(result);
        isPostLiked(postId).then(isLiked => {
            if (isLiked) {
                this.innerHTML = HeartFilled;
                likes_count++;
            } else {
                this.innerHTML = Heart;
                likes_count--;
            };
            document.querySelector(`#likes_count_${postId}`).textContent = likes_count;
        });
    })
    .catch(error => {
        console.log('Error:', error);
    });

};