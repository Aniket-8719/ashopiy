 const incomeIds = dayIncomes.map((inc) => inc._id).filter(Boolean);

      if (incomeIds.length > 0) {
        await DailyIncome.deleteMany({
          user: req.user._id,
          _id: { $in: incomeIds },
        });
      }