# Create Game Form Challenge Inputs

## Challenge Types

- Trivia
- Caesar Cipher
- Word Scramble

For each type of challenge there will need to be a unique way to add them in the Create Game form.

- Trivia challenges can have 3 input fields for the user: description, clue and answer
- Caesar Cipher challenges can have 2 input fields for the user: description and answer
- Word Scramble challenges can have 2 input fields for the user: description and answer

The clues for Caesar Cipher and Word Scramble will be automatically generated. 

Ideally, the clue will be generated on-the-fly by the client and displayed to the user.

> [!NOTE]
> Currently the word scramble challenge has the words scrambled on the challenge page. This should be changed to display exactly what is returned from the DB since the words will now be scrambled in the Create Game form.

## To-do:

Create custom form components for each type of challenge, and pass the data to the form's state to be submitted on game creation.
