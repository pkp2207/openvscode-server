#include <stdio.h>
main (){
	int a,b;
	printf ("Input the required data\n");
	scanf("%d",&a);
	a<<=2;
	b=a;
	printf("The left-shifted data is %d",b);
}
