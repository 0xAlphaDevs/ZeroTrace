fn main(score: u10, category: pub str<9>) {
    // write switch case for the score and category
    if (score >= 750) {
        assert(category == "excellent");
    } else if (score >= 700) {
        assert(category == "__good___");
    } else if (score >= 650) {
        assert(category == "__fair___");
    } else if (score >= 600) {
        assert(category == "__poor___");
    } else if (score < 600) {
        assert(category == "very poor");
    } else {
        assert(false);
    }
}

// ["excellent", "__good___", "__fair___", "__poor___", "very poor"]