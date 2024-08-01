document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', () => compose_email());

  console.log("By default load the inbox!!!!!!!!!!!!!!!!!!!!!!!!!!")
  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#full-email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';


  const composeForm = document.querySelector('#compose-form');
  composeForm.addEventListener('submit', SubmitEmailForm);
};

function SubmitEmailForm(event) {
  
  // Prevent default submission
  event.preventDefault()
  
  // Submit form
  fetch('/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        recipients: document.querySelector('#compose-recipients').value,
        subject: document.querySelector('#compose-subject').value,
        body: document.querySelector('#compose-body').value
    })
  })
  .then(response => response.json())
  .then(result => {
      // Print result
      console.log(result);
      load_mailbox('sent');
  })

  // Catch any errors and log them to the console
  .catch(error => {
    console.log('Error:', error);
  });
};

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#full-email-view').style.display = 'none';

  // Clear the email list to prevent duplicates
  document.querySelector('#emails-view-header').innerHTML = '';
  document.querySelector('#emails-view-body').innerHTML = '';

  // Show the mailbox name
  document.querySelector('#emails-view-header').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Load the mailbox
  fetch(`/emails/${mailbox}`)
  .then(response => {
    return response.json();
  })
  .then(emails => {
    // Clear the email list to prevent duplicates
    document.querySelector('#emails-view-body').innerHTML = '';
    // Print emails
    console.log("Inbox Emails from backend", emails);
    emails.forEach(email => load_email_preview(email, mailbox)); 
  });
};

function load_email_preview(email, mailbox) {
  console.log(`Email #${email.id}:`, email);

  //create Email block
  const email_block = document.createElement('div');
  email_block.className = 'email_block';

  //check if read or unread - and change the background color
  if (!email.read) {
    email_block.classList.add('read');
  }

  //define which email to show - sender or recipients
  let mail_address;
  if (mailbox === 'sent') {
    mail_address = email.recipients.join(', ');
  } else {
     mail_address = email.sender;
  }
      
  //create Sender / Recipients block
  const mailAddressDiv = document.createElement('div');
  mailAddressDiv.className = 'mail_address';
  mailAddressDiv.textContent = mail_address;

  //create Subject block
  const subjectDiv = document.createElement('div');
  subjectDiv.className = 'subject';
  subjectDiv.textContent = email.subject;

  //create Timestamp block
  const timestampDiv = document.createElement('div');
  timestampDiv.className = 'timestamp';
  timestampDiv.textContent = email.timestamp;

  // dispay Email block
  email_block.append(mailAddressDiv, subjectDiv, timestampDiv);

  // add listener to Email Click
  email_block.addEventListener('click', function() {
    console.log(`This element (${email.id}) has been clicked!`);
    load_full_email(email, mailbox)
  });

  // dispay emails (latest on top)
  document.querySelector('#emails-view-body').append(email_block);
      
};

function load_full_email(email, mailbox) {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#full-email-view').style.display = 'block';

  // Clear prev data
  document.querySelector('#email-sender').innerHTML = '';
  document.querySelector('#email-recipients').innerHTML = '';
  document.querySelector('#email-subject').innerHTML = '';
  document.querySelector('#email-timestamp').innerHTML = '';
  document.querySelector('#email-body').innerHTML = '';

  // load email content
  document.querySelector('#email-sender').textContent = email.sender;
  document.querySelector('#email-recipients').textContent = email.recipients.join(', ');
  document.querySelector('#email-subject').textContent = email.subject;
  document.querySelector('#email-timestamp').textContent = email.timestamp;
  document.querySelector('#email-body').textContent = email.body;
  
  // Archive button load / reset and manipulations
  document.querySelector('.email-archive').id = `email-archive-${email.id}`;
  let archive_button = document.querySelector(`#email-archive-${email.id}`);
  archive_button.style.visibility = 'visible';

  // Reply button load (induvidual ID set)
  document.querySelector('.email-reply').id = `email-reply-${email.id}`;
  let reply_button = document.querySelector(`#email-reply-${email.id}`);

  if (mailbox === 'sent') {
    archive_button.style.visibility = 'hidden';
  } else {
    // load correct Archive button msg
    if (email.archived === true) {
      archive_button.textContent = 'Unarchive';
    } else {
      archive_button.textContent = 'Archive';
    };
  };

  // mark it as "read" (is not yet "read")
  if (!email.read) {
    fetch(`/emails/${email.id}`, {
      method: 'PUT',
      body: JSON.stringify({
          read: true
      })
    })
    .catch(error => {
      console.error('Error updating email status:', error);
    });
  };

  // Archive button click (Remove existing event listener before adding a new one)
  archive_button.replaceWith(archive_button.cloneNode(true));
  archive_button = document.querySelector(`#email-archive-${email.id}`);
  archive_button.addEventListener('click', () => archiveEmail(email));

  // Reply button click (Remove existing event listener before adding a new one)
  reply_button.replaceWith(reply_button.cloneNode(true));
  reply_button = document.querySelector(`#email-reply-${email.id}`);
  reply_button.addEventListener('click', () => relpyEmail(email));

};

function relpyEmail(email) {
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#full-email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Pre-fill the composition form with the recipient field set to whoever sent the original email.
  document.querySelector('#compose-recipients').value = `${email.sender}`;
  
  // Pre-fill the subject line
  if (email.subject.includes('Re: ')) {
    document.querySelector('#compose-subject').value = `${email.subject}`;
  } else {
    document.querySelector('#compose-subject').value = `Re: ${email.subject}`;
  };

  // Pre-fill the body of the email
  document.querySelector('#compose-body').value = `\n\n_______\nOn ${email.timestamp} ${email.sender} wrote:\n\n${email.body}`;

  const composeForm = document.querySelector('#compose-form');
  composeForm.addEventListener('submit', SubmitEmailForm);
};

function archiveEmail(email) {
  const new_archive_state = !email.archived;
  fetch(`/emails/${email.id}`, {
    method: 'PUT',
    body: JSON.stringify({
        archived: new_archive_state
    })
  })
  .then(result => {
    console.log(result);
    console.log(`Email #${email.id} archived status updated to: ${new_archive_state}`);
    
    // load Inbox 
    load_mailbox('inbox');
  })
  .catch(error => {
    console.error('Error updating email status:', error);
  });
};

