from cs50 import get_string
import re

sentence = get_string("Text: ")

sentence = sentence.split()

letters = 0
words = 0
sentences = 0

for word in sentence:

    words += 1


    filtered_word = re.sub('[^A-Za-z0-9]+', '', word)
    letters += len(filtered_word)


    sentence_delims = ['!', '?', '.']
    if any(delim in word for delim in sentence_delims):
        sentences += 1



AVERAGE = 100 / words
# Coleman-Liau Index
index = (0.0588 * letters * AVERAGE) - (0.296 * sentences * AVERAGE) - 15.8

if index < 1:
    print("Before Grade 1")
elif index > 16:
    print("Grade 16+")
else:
    print(f"Grade {round(index)}")
