#import "@preview/mitex:0.2.5"

#set text(font: ("New Computer Modern", "SimSun") )

#show heading:it =>{
  if it.level <=3{
    align(center, it)
    
  }
  else{
    align(left, it)
  }
}

#show strong: it => highlight(fill: yellow)[#text(weight: "bold")[#it]]


= Numerical Methods (Building Simulator for Real World)
#figure(
  image("image/Grant_mechanical_calculating_machine_1877.jpg",width: 40%),
)


== Source

- YouTube
  - Numerical Methods Course #link("https://www.youtube.com/playlist?list=PLDea8VeK4MUTOBXLpvx_WKtVrMkojEh52")


- Mathematic
  - MIT Calculus Course
  - 3 Blue 1 Brown


- Related to  
  - Machine Learning

== Keywords
approximate solution 

"Function is everything"

Mathematical Modeling

How can we use numerical methods to solve real-world problems? 

only to find a solution that is close enough to the true answer.


"Creating a simulator" which can model complex systems and predict their behavior over time.

== Review
review in Freeman



=== Calculus

- derivatives



- zero point theorem
$f in C[a,b]$, $f(a)f(b)<0$, then there exists at least one point $c in (a,b)$ such that $f(c)=0$.

what can it use for?


- intermediate value theorem


$f in C[a,b],$

reflect what?


existence of the continuous point

- mean value theorem  

reflect what?
the relation between instantaneous rate of change and average rate of change.
How?


```cpp
#include<iostream>
using namespace std;
int main(){

}


```

- Rolle's theorem

if $f in C[a,b]$ and $f'(x)$ exists for all $x in (a,b)$, and $f(a)=f(b)$, then there exists at least one point $c in (a,b)$ such that $f'(c)=0$.



- Lagarange's mean value theorem
if $f in C[a,b]$ and $f'(x)$ exists for all $x in (a,b)$, then there exists at least one point $c in (a,b)$ such that $f'(c)=$\frac${f(b)-f(a)}{b-a}$.

- Cauchy's mean value theorem

y=f(x)
let y=g(t) x=w(t)


Parameterisation of Lagarange's mean value theorem

/....
fit the function
in real world scenarios


=== Sequences and Series
Taylor series

using polynomial approximation to approximate a function, and find out the "lost part/lost function/remainder"

|

using Lagarange's mean value theorem to estimate the remainder.and ensure the lost function is disappear.


=== Binary Review
「乘二取整，順序排列」

「除二取餘，逆序排列」

why？

float point number can not represent all the real number.


fenmu 


- number theory

IEEE 754 <> what is it?

how to trans real number to double point number?


「差之毫釐，謬以千里」

Error analysis
- Roudoff error
- Truncation error

can not eliminate these errors.


"Perfect is impossible, good enough is enough."



=== week 1
==== error analysis
We hope the number itself can reflect its precision.

make it to significant digit.

$1/2$ the n digit. where n is the nth of !=0 digit.

$1/2$ $10^-n$

$|p-p*|$ / $|p|$ < $10^{1-d} / 2(a_1+1)$

why?  below is the proof. 

$a_1 * 10^{m-1} <= |p*| < (a_1+1) * 10^{m-1} $

1) assume $p*$ got n significant digit.

2) assume $r(p*)$ < $1/2(a_1 + 1)$ , where $r(p*)$ is the relative error of $p*$, 



making error resonable 

how to use it >> ?


Taylor expansion O()


in computer 

| | error is reasonable ???

==== Numerical Stability

question

==== Ill-posed Problem
adding a small perturbation to the input and observing whether it causes a large change in the output.

transform Subtraction (-) into Addition (+)

GNU
#figure(
  image("image/Heckert_GNU_white.svg.png",width: 40%),
)

forget to hw

匯編不會編


pratical solution
- avoid 



==== summary
 
error analysis
- absolute error
  - we need to make the value close to $1/2$ n digit, where nth number !=0
  - here is the methods 
- relative error




=== nonlinear equation 

transcendence function


using some interative method to find the answer.

==== bisection method
==== regula-falsi , position method
enhace speed 

replace mid point

secant

#link("https://en.wikipedia.org/wiki/Regula_falsi")

using a coefficient to solve the problem.

womier


#figure(
  image("image/False_position_method.svg.png",width:40%),
  placement: auto
) <left>

what if we use linear transform in false position method? crazy mind


#raw(read("P1034.cpp"), lang:"cpp")


==== Fixed-Point Iteration
https://en.wikipedia.org/wiki/Banach_fixed-point_theorem

should under what consequence?

if $|g'(x)|<1$ sometime it works

else if $|g'(x)|>=1$ it fails 

when $|g'(x)|=1$ can't judge

->
theorem of banach
contraction mapping

question
what is lipchitz
and how to speed-up

Lagarange mean value theorem to prove it.




==== Newton's method
Newton's method
#link("https://en.wikipedia.org/wiki/Newton%27s_method")

BFGS(Broyden-Fletcher-Goldfarb-Shanno algorithm)
L-BFGS(Limited memory Broyden-Fletcher-Goldfarb-Shanno algorithm)

why use it?
don't need to claculate the Hessian Matrix



=== Addition