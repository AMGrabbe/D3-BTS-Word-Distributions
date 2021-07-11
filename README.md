# Showing BTS word distributions in D3 chart
For this project I picked 5 of my favorite BTS songs to show for each the amount of word sung by each member. 

## Preparations
### Data
I searched the internet for the respective song's lyrics which also had some annotations about who is singing the lines. (*No, I cannot determine who is singing only by hearing the song* :grimacing:)

For start my data set will only include:
```
 - title
 - words sum
 - members
    - name
    - words
```

Later information on the sequence of singing will be added.

### The chart
This project is inspired by Nadieh Bremers project ["The Words in the Lord of the Rings"](https://www.visualcinnamon.com/portfolio/words-lord-of-the-rings/) she wrote about in the book *Data Sketches*. She created her own kind of diagram, which based on **Chord diagrams**.

| |![basic chord diagram](images/chord.jpg)||
|:-:|:--:|:-:|
| |A **chord diagram** represents flows or connections between several entities (called nodes). Each entity is represented by a fragment on the outer part of the circular layout. Then, arcs are drawn between each entities. The size of the arc is proportional to the importance of the flow. *[Data-to-Viz](https://www.data-to-viz.com/graph/chord.html)*||

## References
- [Data: Black Swan Lyrics](https://colorcodedlyrics.com/2020/01/bts-bangtansonyeondan-black-swan)
- Bremer, N. & Wu, S. (2021): Data Sketches
- [D3 Chord diagrams](https://www.d3-graph-gallery.com/chord)
- [Chord diagrams in general](https://www.data-to-viz.com/graph/chord.html)
