String.prototype.replaceAll = function(pSearch, pReplace) {
    return this.split(pSearch).join(pReplace);
};