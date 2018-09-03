module BotsHelper
  def check_ngram(ngram, quest)
    list = quest.downcase.split(ngram.downcase)
    if list.size > 1
      return 1
    end
    return 0
  end

  def check_subset(quest1, quest2)
    if quest1.length > quest2.length
      quest1, quest2 = quest2, quest1
    end
    check = check_ngram(quest1, quest2)
    if check == 1
      return 1
    end
    list_quest1 = quest1.split(" ")
    size_quest1 = list_quest1.size
    countuni, uni = 0, 0
    countbi, bi = 0, 0
    counttri, tri = 0, 0

    for i in 0..size_quest1 - 1
      uni = uni + 1
      checkuni = check_ngram(list_quest1[i], quest2)
      countuni = countuni + checkuni
    end

    for i in 0..(size_quest1 - 2)
      bi = bi + 1
      bigram = list_quest1[i] + list_quest1[i+1]
      checkbi = check_ngram(bigram, quest2)
      countbi = countbi + checkbi
    end

    for i in 0..(size_quest1 - 3)
      tri = tri + 1
      trigram = list_quest1[i] + list_quest1[i+1] + list_quest1[i+2]
      checktri = check_ngram(trigram, quest2)
      counttri = counttri + checktri
    end

    total  = (0.2* countuni / uni) + (0.2 * countbi / bi) + (0.6 * counttri / tri)
  end

  def check_quest_ngram(quest, list_quest)
    max = 0.0
    goal = ""
    for i in 0..list_quest.size - 1
      check = check_subset(quest, list_quest[i]["question"])
      if max < check
        goal = list_quest[i]
      end
    end
    return goal
  end

end
