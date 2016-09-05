---
title: Determining if a Polygon is drawn clockwise or counterclockwise
author: Jim
layout: post
permalink: /determining-if-a-polygon-is-drawn-clockwise-or-counterclockwise-2/
categories:
  - GIS
  - Technology
---
# 

According to the [ESRI Shapefile Documentation][1],  
“The neighborhood to the right of an observer walking along the ring in  
vertex order is the inside of the polygon”.  Meaning that all normal or  
“clean” polygons are drawn in a clockwise fashion.  When it comes to  
holes in the polygons, these are defined by a counterclockwise path  
delineating the polygon.

The first step to  
determining if a polygon is an additive vector or a subtractive one is  
to determine the direction in which the polygon is formed.  ESRI  
Shapefiles do not support polygons that cross their own lines, which  
makes calculating data with them a bit easier.  One method to determine  
the direction the polygon is formed is by using [Green’s Theorem][2].  
This method would require one to take the current coordinate (x1,y1),  
and the next one (x2,y2), and apply the following formula:  
∑(x2-x1)*(y2 y1).  For each line segment, one would then need to add  
the result to a running total, and if the number ends up being  
positive, the polygon is clockwise, and if it is negative, the polygon  
is counterclockwise.

The Formula:

![][3]

  


Example:

  


  KML code:   
Big Triangle  
#stdstyle  
  
  
  
  
 -76, 41,0  
-75, 40,0  
-77, 40,0  
-76, 41,0  
  
  
  
  


![][4]  
(Screenshot from Google Earth)

(Figure 2.1)  Using the KML code above to create the triangle above: Line

Start Coord

End Coord

Equation

Result

1

-76, 41

-75, 40

((-75)-(-76))(40 41)

**81**

2

-75, 40

-77, 40

((-77)-(-75))(40 40)

**-160**

3

-77, 40

-76, 41

((-76)-(-77))(41 40)

**81**







**Total:**

**2**   

  

  


      
 KML code:   
Small Triangle  
#stdstyle  
  
  
  
      
     -76, 40.75,0  
     -76.5, 40.25,0  
     -75.5, 40.25,0  
     -76, 40.75,0  
      
     
    
   


![][5]  
(Screenshot from Google Earth)

(Figure 2.2)  Using the KML code above to create the triangle above:  
 Line

Start Coord

End Coord

Equation

Result

1

-76, 40.75

-76.5, 40.25 

((-76.5)-(-76))(40.25 40.75)

**-40.5**

2

-76.5, 40.25 

-75.5, 40.25

((-75.5)-(-76.5))(40.25 40.25)

**80.5**

3

-75.5, 40.25

-76, 40.75

((-76)-(-75.5))(40.75 40.25)

****-40.5****

  


  


  


**Total:**

**-0.5**

  
    
 
  

  

  


There is also a really good flash based demo on how this works available online here: [http://www.mechanisms101.com/greens\_theorem\_demo.html][6]

 [1]: http://www.esri.com/library/whitepapers/pdfs/shapefile.pdf "ESRI ShapeFile Documentation"
 [2]: http://mathworld.wolfram.com/GreensTheorem.html "Green's Theorem"
 [3]: http://loc8.us/extras/other/insideout.png "∑(x2-x1)*(y2 y1)"
 [4]: http://docs.google.com/File?id=dfsrw3g_533wrkvtw_b
 [5]: http://docs.google.com/File?id=dfsrw3g_6dfp2pdgz_b
 [6]: http://www.mechanisms101.com/greens_theorem_demo.html "http://www.mechanisms101.com/greens_theorem_demo.html"