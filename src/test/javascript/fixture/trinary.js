var trinary = function( x ) {
    this.xzxz = x ? x : ( x ? x : 2 ); // oddly does not get a line number
    var xz = x ? 
            x : ( x ? x : 2 ); // oddly does not get a line number
        return xz;
};
trinary();
trinary(1);
