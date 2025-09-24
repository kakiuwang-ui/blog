// bisection method find the solution of one-dimantional equation 
// when in real world problem, we first draw the plot to figure out the area of the solution.

#include <iostream>
#include <cstdio>
using namespace std;

double a,b,c,d;

double f(double x)
{
    return a*x*x*x + b*x*x + c*x + d;
}

double search (double l, double r)
{
    double mid;
    bool flat = true;
    for (int i=0; i<=500; i++)
    {
        mid = (l+r)/2.0;
        if (f(l)*f(mid)<=0)
            r=mid;
        else if (f(r)*f(mid)<=0)
            l=mid;
        else 
        {
            flat = false;
            break;
        }
    }
    if (flat)
        return mid;
    
    return -101;
}

int main ()
{

    cin >> a >> b >> c >> d;
    double x[4]={0};
    double solution;
    int count = 0;
    for (int i = -100; i<= 100; i++)
    {
        solution = search (i,i+1);
        if (solution != -101 && x[1]!=solution && x[2]!= solution && x[3]!=solution)
        {
            count ++;
            x[count]=solution;
        }
    }
    printf("%.2lf %.2lf %.2lf",x[1],x[2],x[3]);

    return 0;
}